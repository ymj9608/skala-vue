<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useConfigStore } from '../../stores/configStore.js'

const KAKAO_MAP_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY
const OPEN_WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'

const router = useRouter()
const configStore = useConfigStore()
const mapContainer = ref(null)
const selectedRegion = ref('')
const selectedWeather = ref(null)
const selectedPosition = ref(null)
const isMapLoading = ref(true)
const isWeatherLoading = ref(false)
const errorMessage = ref('')

const displayTemp = computed(() => {
  if (!selectedWeather.value) {
    return ''
  }

  const rawTemp = selectedWeather.value.temp

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
})

const fetchWeather = async (lat, lon) => {
  isWeatherLoading.value = true
  errorMessage.value = ''

  try {
    const response = await axios.get(WEATHER_URL, {
      params: {
        lat: lat,
        lon: lon,
        appid: OPEN_WEATHER_API_KEY,
        units: 'metric',
        lang: 'kr',
      },
    })

    selectedWeather.value = {
      name: response.data.name,
      temp: Math.round(response.data.main.temp),
      status: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      wind: response.data.wind.speed,
    }
  } catch (error) {
    console.error('지도 날씨 조회 실패:', error)
    errorMessage.value = '선택한 위치의 날씨를 가져오지 못했습니다.'
  } finally {
    isWeatherLoading.value = false
  }
}

const showDetail = () => {
  const region = selectedRegion.value || selectedWeather.value.name

  router.push(
    '/map-weather/' +
      selectedPosition.value.lat +
      '/' +
      selectedPosition.value.lon +
      '?region=' +
      region,
  )
}

const createMap = () => {
  const kakao = window.kakao
  const centerPosition = new kakao.maps.LatLng(36.3504, 127.3845)
  const map = new kakao.maps.Map(mapContainer.value, {
    center: centerPosition,
    level: 13,
  })
  const marker = new kakao.maps.Marker({
    map: map,
    position: centerPosition,
  })
  const geocoder = new kakao.maps.services.Geocoder()
  const zoomControl = new kakao.maps.ZoomControl()

  map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)

  kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
    const position = mouseEvent.latLng
    const lat = position.getLat()
    const lon = position.getLng()

    marker.setPosition(position)
    selectedRegion.value = ''
    selectedPosition.value = { lat: lat, lon: lon }

    geocoder.coord2RegionCode(lon, lat, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        selectedRegion.value = result[0].address_name
      }
    })

    fetchWeather(lat, lon)
  })

  isMapLoading.value = false
}

const loadKakaoMap = () => {
  if (window.kakao && window.kakao.maps) {
    window.kakao.maps.load(createMap)
    return
  }

  const script = document.createElement('script')
  script.id = 'kakao-map-script'
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false&libraries=services`
  script.onload = () => {
    window.kakao.maps.load(createMap)
  }
  script.onerror = () => {
    isMapLoading.value = false
    errorMessage.value = '카카오 지도를 불러오지 못했습니다. 등록된 도메인을 확인해 주세요.'
  }
  document.head.appendChild(script)
}

onMounted(() => {
  loadKakaoMap()
})
</script>

<template>
  <div class="weather-map-area">
    <p class="map-guide">지도를 클릭하면 해당 위치의 실시간 날씨가 표시됩니다.</p>

    <div class="map-box">
      <div ref="mapContainer" class="map"></div>
      <p v-if="isMapLoading" class="map-loading">카카오 지도를 불러오는 중입니다.</p>
    </div>

    <el-skeleton v-if="isWeatherLoading" class="weather-message" :rows="2" animated />
    <el-alert
      v-else-if="errorMessage"
      class="weather-message"
      :title="errorMessage"
      type="error"
      :closable="false"
      show-icon
    />

    <article
      v-else-if="selectedWeather"
      :class="['map-weather-card', selectedWeather.temp >= 25 ? 'hot-card' : 'cool-card']"
    >
      <div class="weather-info">
        <h3>
          📍 {{ selectedRegion || selectedWeather.name }}
          <template v-if="configStore.showWeatherStatus">({{ selectedWeather.status }})</template>
        </h3>
        <p>현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
        <p>습도: {{ selectedWeather.humidity }}%</p>
        <p>풍속: {{ selectedWeather.wind }}m/s</p>
        <template v-if="configStore.showWeatherStatus">
          <el-tag
            v-if="selectedWeather.temp >= 25"
            class="weather-label"
            type="danger"
            effect="dark"
          >
            🔥 더움 (25도 이상)
          </el-tag>
          <el-tag v-else class="weather-label" type="primary" effect="dark">
            ❄️ 선선함 (25도 미만)
          </el-tag>
        </template>
      </div>

      <el-button type="primary" plain @click="showDetail">상세보기</el-button>
    </article>
  </div>
</template>

<style scoped>
.map-guide {
  margin: 0 0 10px;
  color: #587083;
}

.map-box {
  position: relative;
}

.map {
  width: 100%;
  height: 380px;
  border: 1px solid #d7e4ed;
  border-radius: 8px;
  background-color: #edf3f7;
}

.map-loading {
  position: absolute;
  top: 45%;
  left: 0;
  width: 100%;
  margin: 0;
  color: #587083;
  text-align: center;
}

.weather-message {
  margin: 12px 0 0;
  padding: 18px;
  border-radius: 7px;
  background-color: white;
  color: #587083;
  text-align: center;
}

.map-weather-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 118px;
  margin-top: 12px;
  padding: 16px;
  border: 2px solid #e0e5e8;
  border-radius: 7px;
  background-color: white;
  color: #28516e;
}

.weather-info h3 {
  margin: 0 0 7px;
  color: #284f6b;
  font-size: 18px;
  font-weight: normal;
}

.weather-info p {
  margin: 3px 0;
}

.hot-card {
  border-left-color: #ff6b6b;
}

.cool-card {
  border-left-color: #4db7f5;
}

.weather-label {
  margin-top: 4px;
}

.map-weather-card > .el-button {
  margin-left: 20px;
}
</style>
