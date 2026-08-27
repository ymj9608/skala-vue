<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import WeatherMap from '../components/exercise/WeatherMap.vue'

const router = useRouter()
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'

const cityList = [
  { id: 'city_01', name: '서울', lat: 37.5665, lon: 126.978 },
  { id: 'city_02', name: '수원', lat: 37.2636, lon: 127.0286 },
  { id: 'city_03', name: '부산', lat: 35.1796, lon: 129.0756 },
  { id: 'city_04', name: '대전', lat: 36.3504, lon: 127.3845 },
]
const weatherList = ref([])
const searchCity = ref('')
const selectedCity = ref('')
const hotCityClickCount = ref(0)
const isLoading = ref(false)
const errorMessage = ref('')

const filteredWeatherList = computed(() => {
  if (searchCity.value === '') {
    return weatherList.value
  }

  return weatherList.value.filter((weather) => weather.name.includes(searchCity.value))
})

const hotCityClickMessage = computed(() => {
  return `더운 도시 카드 클릭 횟수: ${hotCityClickCount.value}회`
})

const updateSearchCity = (query) => {
  searchCity.value = query
}

const selectCity = (weather) => {
  selectedCity.value = weather.name

  if (weather.temp >= 25) {
    hotCityClickCount.value++
  }
}

const showDetail = (weather) => {
  router.push('/weather/' + weather.id)
}

const fetchWeatherList = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const newWeatherList = []

    for (const city of cityList) {
      const response = await axios.get(WEATHER_URL, {
        params: {
          lat: city.lat,
          lon: city.lon,
          appid: API_KEY,
          units: 'metric',
          lang: 'kr',
        },
      })

      newWeatherList.push({
        id: city.id,
        name: city.name,
        temp: Math.round(response.data.main.temp),
        status: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        wind: response.data.wind.speed,
      })
    }

    weatherList.value = newWeatherList
  } catch (error) {
    console.error('실시간 날씨 조회 실패:', error)
    errorMessage.value = '실시간 날씨를 가져오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

watch(selectedCity, (newValue) => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트 되었습니다 -> ${newValue}이 선택되었습니다.`)
})

watch(hotCityClickCount, (newValue) => {
  console.log(`더운 도시 카드를 ${newValue}번 클릭했습니다.`)
})

watchEffect(() => {
  console.log(`[watchEffect 자동 호출] 현재 검색어: ${searchCity.value}`)
})

onMounted(() => {
  fetchWeatherList()
})
</script>

<template>
  <main class="weather-view">
    <BaseDashboardCard title="도시 검색" icon="🔍">
      <SearchBar :query="searchCity" @update-query="updateSearchCity" />
    </BaseDashboardCard>

    <BaseDashboardCard title="지도에서 날씨 찾기" icon="🗺️">
      <WeatherMap />
    </BaseDashboardCard>

    <BaseDashboardCard title="지역별 날씨 현황" icon="🏙️">
      <el-skeleton v-if="isLoading" class="api-message" :rows="4" animated />

      <div v-else-if="errorMessage" class="api-message error-message">
        <el-alert :title="errorMessage" type="error" :closable="false" show-icon />
        <el-button type="danger" plain @click="fetchWeatherList">다시 불러오기</el-button>
      </div>

      <WeatherCard
        v-for="weather in filteredWeatherList"
        :key="weather.id"
        :weather="weather"
        :is-selected="selectedCity === weather.name"
        @select-card="selectCity"
        @click-detail="showDetail"
      />

      <el-empty
        v-if="!isLoading && !errorMessage && filteredWeatherList.length === 0"
        description="검색 결과와 일치하는 도시가 없습니다."
        :image-size="70"
      />
    </BaseDashboardCard>

    <div class="status-box">
      <p v-if="selectedCity">{{ selectedCity }}이 선택되었습니다.</p>
      <p v-else>카드를 클릭하거나 검색해 보세요.</p>
      <p v-if="selectedCity" class="click-count">{{ hotCityClickMessage }}</p>
    </div>
  </main>
</template>

<style scoped>
.weather-view {
  width: 100%;
}

.api-message {
  margin: 12px 0 0;
  padding: 24px;
  border: 1px solid #d7e4ed;
  border-radius: 8px;
  background-color: white;
  color: #587083;
  text-align: center;
}

.error-message {
  border-color: #f0c5c5;
}

.error-message .el-button {
  margin-top: 10px;
}

.status-box {
  margin-top: 18px;
  padding: 13px;
  border-radius: 7px;
  background-color: #e3f6e8;
  color: #008c3a;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

.status-box p {
  margin: 0;
}

.click-count {
  margin-top: 7px !important;
  padding-top: 7px;
  border-top: 1px solid #b8ddc4;
  font-size: 14px;
}
</style>
