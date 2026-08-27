<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useConfigStore } from '../../stores/configStore.js'
import AppIcon from './AppIcon.vue'

const KAKAO_MAP_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY
const OPEN_WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'

const props = defineProps({
  weatherList: {
    type: Array,
    required: true,
  },
  focusWeather: {
    type: Object,
    default: null,
  },
})
const emit = defineEmits(['select-region'])

const router = useRouter()
const configStore = useConfigStore()
const mapContainer = ref(null)
const selectedRegion = ref('')
const selectedWeather = ref(null)
const selectedPosition = ref(null)
const isMapLoading = ref(true)
const isWeatherLoading = ref(false)
const errorMessage = ref('')
const weatherOverlays = []
let weatherMap = null
let mapResizeObserver = null
let lastValidCenter = null

const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode || '03d'}@2x.png`
}

const convertTemp = (temp) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((temp * 9) / 5 + 32)
  }

  return temp
}

const displayWeatherOverlays = () => {
  if (!weatherMap || !window.kakao) {
    return
  }

  for (const overlay of weatherOverlays) {
    overlay.setMap(null)
  }
  weatherOverlays.splice(0)

  for (const weather of props.weatherList) {
    const content = document.createElement('div')
    const icon = document.createElement('img')
    const cityName = document.createElement('strong')
    const temperature = document.createElement('small')
    const markerWeather = document.createElement('div')

    content.className = 'weather-location-marker'
    markerWeather.className = 'marker-weather'
    icon.className = 'marker-icon'
    icon.src = getWeatherIconUrl(weather.iconCode)
    icon.alt = weather.status
    cityName.textContent = weather.mapName
    temperature.textContent = convertTemp(weather.temp) + configStore.unitSymbol

    content.appendChild(cityName)
    markerWeather.appendChild(icon)
    markerWeather.appendChild(temperature)
    content.appendChild(markerWeather)

    const overlay = new window.kakao.maps.CustomOverlay({
      map: weatherMap,
      position: new window.kakao.maps.LatLng(weather.lat, weather.lon),
      content: content,
      xAnchor: weather.markerXAnchor === undefined ? 0.5 : weather.markerXAnchor,
      yAnchor: 0.5,
    })

    weatherOverlays.push(overlay)
  }
}

const displayTemp = computed(() => {
  if (!selectedWeather.value) {
    return ''
  }

  return convertTemp(selectedWeather.value.temp)
})

const focusMapOnWeather = (weather) => {
  if (!weatherMap || !window.kakao || !weather) {
    return
  }

  const lat = weather.focusLat === undefined ? weather.lat : weather.focusLat
  const lon = weather.focusLon === undefined ? weather.lon : weather.focusLon
  const position = new window.kakao.maps.LatLng(lat, lon)

  selectedWeather.value = weather
  selectedRegion.value = weather.focusName ? `${weather.name} ${weather.focusName}` : weather.name
  selectedPosition.value = { lat: lat, lon: lon }
  lastValidCenter = position
  weatherMap.setLevel(5)
  weatherMap.panTo(position)
}

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
      iconCode: response.data.weather[0].icon,
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
  const koreaBounds = new kakao.maps.LatLngBounds(
    new kakao.maps.LatLng(32.8, 124.3),
    new kakao.maps.LatLng(39.8, 131.3),
  )
  const map = new kakao.maps.Map(mapContainer.value, {
    center: centerPosition,
    level: 13,
  })
  const marker = new kakao.maps.Marker({
    position: centerPosition,
  })
  const geocoder = new kakao.maps.services.Geocoder()
  const zoomControl = new kakao.maps.ZoomControl()

  weatherMap = map
  lastValidCenter = centerPosition
  map.setMapTypeId(kakao.maps.MapTypeId.HYBRID)
  map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT)
  displayWeatherOverlays()
  focusMapOnWeather(props.focusWeather)

  mapResizeObserver = new ResizeObserver(() => {
    const currentCenter = map.getCenter()
    map.relayout()
    map.setCenter(currentCenter)
  })
  mapResizeObserver.observe(mapContainer.value)

  kakao.maps.event.addListener(map, 'center_changed', () => {
    const currentCenter = map.getCenter()

    if (koreaBounds.contain(currentCenter)) {
      lastValidCenter = currentCenter
      return
    }

    map.setCenter(lastValidCenter)
  })

  kakao.maps.event.addListener(map, 'zoom_changed', () => {
    if (map.getLevel() > 14) {
      map.setLevel(14)
    }

    if (map.getLevel() < 3) {
      map.setLevel(3)
    }
  })

  kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
    const position = mouseEvent.latLng
    const lat = position.getLat()
    const lon = position.getLng()

    marker.setMap(map)
    marker.setPosition(position)
    selectedRegion.value = ''
    selectedPosition.value = { lat: lat, lon: lon }

    geocoder.coord2RegionCode(lon, lat, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        selectedRegion.value = result[0].address_name
        emit('select-region', result[0].address_name)
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

onUnmounted(() => {
  if (mapResizeObserver) {
    mapResizeObserver.disconnect()
  }
})

watch(
  () => props.weatherList,
  () => {
    displayWeatherOverlays()
  },
  { deep: true },
)

watch(
  () => configStore.unit,
  () => {
    displayWeatherOverlays()
  },
)

watch(
  () => props.focusWeather,
  (weather) => {
    focusMapOnWeather(weather)
  },
)
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
          <AppIcon name="pin" :size="19" />
          {{ selectedRegion || selectedWeather.name }}
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
            <AppIcon name="hot" :size="14" />
            더움 (25도 이상)
          </el-tag>
          <el-tag v-else class="weather-label" type="primary" effect="dark">
            <AppIcon name="cool" :size="14" />
            선선함 (25도 미만)
          </el-tag>
        </template>
      </div>

      <el-button class="detail-button" type="primary" @click="showDetail">
        상세보기
        <AppIcon name="arrow" :size="15" />
      </el-button>
    </article>

    <div v-else class="map-selection-placeholder">
      <span><AppIcon name="pin" :size="22" /></span>
      <div>
        <strong>원하는 지역을 선택해 보세요</strong>
        <p>지도 위 위치를 클릭하면 기온, 습도와 풍속을 확인할 수 있습니다.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-map-area {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.map-guide {
  margin: 0 0 10px;
  padding: 8px 11px;
  border-left: 4px solid #24a8d4;
  background-color: #e6f5fc;
  color: #3e7089;
  font-size: 13px;
}

.map-box {
  position: relative;
  flex: 1;
  min-height: 390px;
}

.map {
  width: 100%;
  height: 100%;
  border: 1px solid #79b5d3;
  border-radius: 7px;
  background-color: #edf3f7;
  box-shadow: 0 5px 13px rgba(10, 86, 128, 0.14);
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
  border: 1px solid #b7d4e3;
  border-left: 5px solid #8bb8ce;
  border-radius: 7px;
  background: linear-gradient(105deg, #ffffff, #eaf7fd);
  color: #28516e;
  box-shadow: 0 4px 10px rgba(10, 86, 128, 0.1);
}

.weather-info h3 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 7px;
  color: #0b557e;
  font-size: 18px;
  font-weight: bold;
}

.weather-info p {
  margin: 3px 0;
}

.hot-card {
  border-left-color: #ff7043;
}

.cool-card {
  border-left-color: #1ea7d6;
}

.weather-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.map-weather-card > .el-button {
  margin-left: 20px;
}

.detail-button :deep(span) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.map-selection-placeholder {
  display: flex;
  align-items: center;
  min-height: 118px;
  margin-top: 12px;
  padding: 16px 18px;
  border: 1px dashed #9fc8da;
  border-radius: 9px;
  background: linear-gradient(110deg, #f8fcfe, #e8f5fa);
  color: #436f84;
}

.map-selection-placeholder > span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  margin-right: 13px;
  border-radius: 13px;
  background-color: #d6eff9;
  color: #087caf;
}

.map-selection-placeholder strong {
  color: #135d81;
  font-size: 15px;
}

.map-selection-placeholder p {
  margin: 3px 0 0;
  font-size: 13px;
}

.weather-map-area :deep(.weather-location-marker) {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 70px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  overflow: hidden;
  background-color: rgba(43, 122, 165, 0.76);
  color: white;
  font-size: 11px;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(0, 48, 77, 0.3);
}

.weather-map-area :deep(.marker-weather) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 43px;
  padding: 2px 7px 3px;
  background: linear-gradient(180deg, rgba(88, 170, 207, 0.78), rgba(40, 126, 169, 0.86));
}

.weather-map-area :deep(.marker-icon) {
  width: 34px;
  height: 34px;
  object-fit: contain;
  filter: drop-shadow(0 3px 2px rgba(0, 31, 49, 0.32));
}

.weather-map-area :deep(.weather-location-marker strong) {
  display: block;
  width: 100%;
  padding: 5px 8px;
  background: linear-gradient(90deg, #075984, #0a6d9d);
  text-align: center;
  font-weight: bold;
}

.weather-map-area :deep(.weather-location-marker small) {
  color: #ffe28a;
  font-weight: bold;
}
</style>
