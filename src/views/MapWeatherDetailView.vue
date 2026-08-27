<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import { RouterLink, useRoute } from 'vue-router'
import { useConfigStore } from '../stores/configStore.js'

const route = useRoute()
const configStore = useConfigStore()
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'

const selectedWeather = ref(null)
const forecastList = ref([])
const airQuality = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const displayTemp = computed(() => {
  if (!selectedWeather.value) {
    return ''
  }

  return convertTemp(selectedWeather.value.temp)
})

const airQualityLabel = computed(() => {
  if (!airQuality.value) {
    return ''
  }

  if (airQuality.value.us_aqi <= 50) {
    return '좋음'
  }

  if (airQuality.value.us_aqi <= 100) {
    return '보통'
  }

  if (airQuality.value.us_aqi <= 150) {
    return '민감군 나쁨'
  }

  return '나쁨'
})

const convertTemp = (temp) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((temp * 9) / 5 + 32)
  }

  return temp
}

const fetchMapWeatherDetail = async () => {
  const lat = route.params.lat
  const lon = route.params.lon

  isLoading.value = true
  errorMessage.value = ''

  try {
    const weatherResponse = await axios.get(WEATHER_URL, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'kr',
      },
    })

    const forecastResponse = await axios.get(FORECAST_URL, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'kr',
      },
    })

    const airQualityResponse = await axios.get(AIR_QUALITY_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'pm10,pm2_5,us_aqi',
      },
    })

    selectedWeather.value = {
      name: route.query.region || weatherResponse.data.name,
      temp: Math.round(weatherResponse.data.main.temp),
      feelsLike: Math.round(weatherResponse.data.main.feels_like),
      status: weatherResponse.data.weather[0].description,
      humidity: weatherResponse.data.main.humidity,
      pressure: weatherResponse.data.main.pressure,
      wind: weatherResponse.data.wind.speed,
    }

    forecastList.value = forecastResponse.data.list.slice(0, 4).map((forecast) => {
      return {
        date: forecast.dt_txt,
        temp: Math.round(forecast.main.temp),
        status: forecast.weather[0].description,
      }
    })

    airQuality.value = airQualityResponse.data.current
  } catch (error) {
    console.error('지도 상세 날씨 조회 실패:', error)
    errorMessage.value = '선택한 위치의 상세 날씨를 가져오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchMapWeatherDetail()
})
</script>

<template>
  <main class="detail-view">
    <section class="detail-card">
      <h2>🗺️ 지도 선택 지역 상세 날씨</h2>

      <el-skeleton v-if="isLoading" class="api-message" :rows="5" animated />

      <div v-else-if="errorMessage" class="api-message error-message">
        <el-alert :title="errorMessage" type="error" :closable="false" show-icon />
        <el-button type="danger" plain @click="fetchMapWeatherDetail"> 다시 불러오기 </el-button>
      </div>

      <template v-else-if="selectedWeather">
        <div class="weather-detail">
          <p>📍 선택 지역: {{ selectedWeather.name }}</p>
          <p>위도: {{ route.params.lat }}</p>
          <p>경도: {{ route.params.lon }}</p>
          <p>실시간 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
          <p>체감 온도: {{ convertTemp(selectedWeather.feelsLike) }}{{ configStore.unitSymbol }}</p>
          <p v-if="configStore.showWeatherStatus">기상 현황: {{ selectedWeather.status }}</p>
          <p>대기 습도: {{ selectedWeather.humidity }}%</p>
          <p>기압: {{ selectedWeather.pressure }}hPa</p>
          <p>현재 풍속: {{ selectedWeather.wind }}m/s</p>
        </div>

        <section class="extra-section">
          <h3>🕒 시간대별 예보</h3>
          <div class="forecast-list">
            <div v-for="forecast in forecastList" :key="forecast.date" class="forecast-item">
              <p>{{ forecast.date }}</p>
              <strong>{{ convertTemp(forecast.temp) }}{{ configStore.unitSymbol }}</strong>
              <p>{{ forecast.status }}</p>
            </div>
          </div>
        </section>

        <section v-if="airQuality" class="extra-section">
          <h3>🌿 선택 지역 대기질</h3>
          <div class="air-quality">
            <p>통합 대기질: {{ airQuality.us_aqi }} ({{ airQualityLabel }})</p>
            <p>미세먼지 PM10: {{ airQuality.pm10 }}㎍/㎥</p>
            <p>초미세먼지 PM2.5: {{ airQuality.pm2_5 }}㎍/㎥</p>
          </div>
        </section>
      </template>

      <RouterLink class="back-link" to="/">← 지도로 돌아가기</RouterLink>
    </section>
  </main>
</template>

<style scoped>
.detail-view {
  width: 100%;
}

.detail-card {
  margin-top: 18px;
  padding: 22px;
  border: 1px solid #dfe6eb;
  border-radius: 10px;
  background-color: white;
}

h2 {
  margin: 0 0 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid #dfe6eb;
  color: #294b66;
  font-size: 21px;
  font-weight: normal;
}

.weather-detail {
  padding: 18px;
  border-radius: 7px;
  background-color: #f1f4f8;
  color: #35495e;
}

.weather-detail p {
  margin: 3px 0;
}

.api-message {
  padding: 26px;
  border-radius: 7px;
  background-color: #f1f4f8;
  color: #587083;
  text-align: center;
}

.error-message .el-button {
  margin-top: 10px;
}

.extra-section {
  margin-top: 18px;
  padding: 16px;
  border: 1px solid #dfe6eb;
  border-radius: 7px;
}

.extra-section h3 {
  margin: 0 0 12px;
  color: #294b66;
  font-size: 17px;
}

.forecast-list {
  display: flex;
  gap: 8px;
}

.forecast-item {
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  background-color: #f1f7fb;
  color: #587083;
  text-align: center;
}

.forecast-item p {
  margin: 3px 0;
  font-size: 13px;
}

.forecast-item strong {
  color: #294b66;
  font-size: 18px;
}

.air-quality {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.air-quality p {
  flex: 1;
  margin: 0;
  padding: 11px;
  border-radius: 5px;
  background-color: #eef8f0;
  color: #32714a;
  text-align: center;
}

.back-link {
  display: inline-block;
  margin-top: 16px;
  padding: 8px 13px;
  border-radius: 4px;
  background-color: #294b66;
  color: white;
  text-decoration: none;
}
</style>
