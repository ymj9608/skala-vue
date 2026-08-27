<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import WeatherMap from '../components/exercise/WeatherMap.vue'
import AppIcon from '../components/exercise/AppIcon.vue'

const router = useRouter()
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'

const cityList = [
  {
    id: 'city_01',
    name: '서울특별시',
    mapName: '서울',
    markerXAnchor: 0,
    lat: 37.5665,
    lon: 126.978,
    focusName: '서울역',
    focusLat: 37.5547,
    focusLon: 126.9706,
    showInDefault: true,
  },
  {
    id: 'city_02',
    name: '부산광역시',
    mapName: '부산',
    markerXAnchor: 1,
    lat: 35.1796,
    lon: 129.0756,
    focusName: '부산역',
    focusLat: 35.1151,
    focusLon: 129.0414,
    showInDefault: true,
  },
  {
    id: 'city_03',
    name: '대구광역시',
    mapName: '대구',
    lat: 35.8714,
    lon: 128.6014,
    focusName: '동대구역',
    focusLat: 35.8797,
    focusLon: 128.6285,
    showInDefault: true,
  },
  {
    id: 'city_04',
    name: '인천광역시',
    mapName: '인천',
    markerXAnchor: 1,
    lat: 37.4563,
    lon: 126.7052,
    focusName: '인천역',
    focusLat: 37.4767,
    focusLon: 126.6169,
    showInDefault: true,
  },
  {
    id: 'city_05',
    name: '광주광역시',
    mapName: '광주',
    lat: 35.1595,
    lon: 126.8526,
    focusName: '광주송정역',
    focusLat: 35.1376,
    focusLon: 126.7915,
    showInDefault: true,
  },
  {
    id: 'city_06',
    name: '대전광역시',
    mapName: '대전',
    markerXAnchor: 0,
    lat: 36.3504,
    lon: 127.3845,
    focusName: '대전역',
    focusLat: 36.3323,
    focusLon: 127.4341,
    showInDefault: true,
  },
  {
    id: 'city_07',
    name: '울산광역시',
    mapName: '울산',
    markerXAnchor: 0,
    lat: 35.5384,
    lon: 129.3114,
    focusName: '울산역',
    focusLat: 35.5514,
    focusLon: 129.1386,
    showInDefault: true,
  },
  {
    id: 'city_08',
    name: '세종특별자치시',
    mapName: '세종',
    markerXAnchor: 1,
    lat: 36.48,
    lon: 127.289,
    focusName: '세종시청',
    focusLat: 36.48,
    focusLon: 127.289,
    showInDefault: true,
  },
  {
    id: 'region_taebaek',
    name: '태백시',
    mapName: '태백',
    markerXAnchor: 0,
    lat: 37.1641,
    lon: 128.9856,
    focusName: '태백역',
    focusLat: 37.1769,
    focusLon: 128.989,
    showInDefault: false,
  },
]

const weatherList = ref([])
const searchedWeatherList = ref([])
const legalDistrictList = ref([])
const searchCity = ref('')
const selectedSearchRegion = ref('')
const selectedCity = ref('')
const selectedWeatherForMap = ref(null)
const hotCityClickCount = ref(0)
const isLoading = ref(false)
const isSearchLoading = ref(false)
const errorMessage = ref('')
const searchErrorMessage = ref('')

const filteredWeatherList = computed(() => {
  if (searchCity.value === '') {
    return weatherList.value.filter((weather) => weather.showInDefault)
  }

  return searchedWeatherList.value
})

const displayedErrorMessage = computed(() => {
  if (searchCity.value !== '') {
    return searchErrorMessage.value
  }

  return errorMessage.value
})

const matchingLegalDistrictList = computed(() => {
  if (searchCity.value === '' || selectedSearchRegion.value === searchCity.value) {
    return []
  }

  return legalDistrictList.value.filter((regionName) => regionName.includes(searchCity.value))
})

const hotCityClickMessage = computed(() => {
  return `더운 도시 카드 클릭 횟수: ${hotCityClickCount.value}회`
})

const hasFinalConsonant = (text) => {
  if (text === '') {
    return false
  }

  const lastCharacter = text.charAt(text.length - 1)
  const characterCode = lastCharacter.charCodeAt(0)

  if (characterCode < 0xac00 || characterCode > 0xd7a3) {
    return false
  }

  return (characterCode - 0xac00) % 28 !== 0
}

const selectedCityMessage = computed(() => {
  if (selectedCity.value === '') {
    return ''
  }

  const subjectMarker = hasFinalConsonant(selectedCity.value) ? '이' : '가'
  return `${selectedCity.value}${subjectMarker} 선택되었습니다.`
})

const selectCity = (weather) => {
  selectedCity.value = weather.name
  selectedWeatherForMap.value = weather

  if (weather.temp >= 25) {
    hotCityClickCount.value++
  }
}

const selectMapRegion = (regionName) => {
  selectedCity.value = regionName
}

const showDetail = (weather) => {
  if (weather.showInDefault) {
    router.push('/weather/' + weather.id)
    return
  }

  router.push('/map-weather/' + weather.lat + '/' + weather.lon + '?region=' + weather.name)
}

const createWeatherData = (city, response) => {
  return {
    id: city.id,
    name: city.name,
    mapName: city.mapName,
    markerXAnchor: city.markerXAnchor,
    lat: city.lat,
    lon: city.lon,
    focusName: city.focusName,
    focusLat: city.focusLat,
    focusLon: city.focusLon,
    showInDefault: city.showInDefault === true,
    temp: Math.round(response.data.main.temp),
    status: response.data.weather[0].description,
    condition: response.data.weather[0].main,
    iconCode: response.data.weather[0].icon,
    humidity: response.data.main.humidity,
    wind: response.data.wind.speed,
  }
}

const fetchOneWeather = async (city) => {
  const response = await axios.get(WEATHER_URL, {
    params: {
      lat: city.lat,
      lon: city.lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  return createWeatherData(city, response)
}

const updateSearchCity = (query) => {
  searchCity.value = query
  selectedSearchRegion.value = ''
  searchedWeatherList.value = []
  searchErrorMessage.value = ''

  if (query === '') {
    isSearchLoading.value = false
  }
}

const selectSearchRegion = (regionName) => {
  selectedSearchRegion.value = regionName
  selectedCity.value = regionName
  searchCity.value = regionName
  searchedWeatherList.value = []
  searchErrorMessage.value = ''
  isSearchLoading.value = true

  if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
    searchErrorMessage.value = '지도가 준비된 후 다시 검색해 주세요.'
    isSearchLoading.value = false
    return
  }

  const geocoder = new window.kakao.maps.services.Geocoder()

  geocoder.addressSearch(regionName, async (result, status) => {
    if (status !== window.kakao.maps.services.Status.OK || result.length === 0) {
      searchErrorMessage.value = '선택한 지역의 좌표를 찾지 못했습니다.'
      isSearchLoading.value = false
      return
    }

    const region = {
      id: 'search_' + result[0].x + '_' + result[0].y,
      name: regionName,
      mapName: regionName.split(' ').pop(),
      lat: Number(result[0].y),
      lon: Number(result[0].x),
      showInDefault: false,
    }

    try {
      const weather = await fetchOneWeather(region)
      searchedWeatherList.value = [weather]
    } catch (error) {
      console.error('법정동 날씨 검색 실패:', error)
      searchErrorMessage.value = '선택한 지역의 날씨를 가져오지 못했습니다.'
    } finally {
      isSearchLoading.value = false
    }
  })
}

const loadLegalDistrictList = async () => {
  try {
    const response = await fetch(import.meta.env.BASE_URL + 'data/korean-legal-districts.txt')
    const text = await response.text()

    legalDistrictList.value = text.split('\n').filter((regionName) => regionName !== '')
  } catch (error) {
    console.error('법정동 목록 불러오기 실패:', error)
    searchErrorMessage.value = '국내 지역 검색 목록을 불러오지 못했습니다.'
  }
}

const retryWeather = () => {
  if (selectedSearchRegion.value !== '') {
    selectSearchRegion(selectedSearchRegion.value)
    return
  }

  fetchWeatherList()
}

const fetchWeatherList = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const newWeatherList = []

    for (const city of cityList) {
      const weather = await fetchOneWeather(city)
      newWeatherList.push(weather)
    }

    weatherList.value = newWeatherList
  } catch (error) {
    console.error('실시간 날씨 조회 실패:', error)
    errorMessage.value = '실시간 날씨를 가져오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

watch(selectedCity, () => {
  console.log(`[watch 감지] 상태 바 문구가 업데이트 되었습니다 -> ${selectedCityMessage.value}`)
})

watch(hotCityClickCount, (newValue) => {
  console.log(`더운 도시 카드를 ${newValue}번 클릭했습니다.`)
})

watchEffect(() => {
  console.log(`[watchEffect 자동 호출] 현재 검색어: ${searchCity.value}`)
})

onMounted(() => {
  fetchWeatherList()
  loadLegalDistrictList()
})
</script>

<template>
  <main class="weather-view">
    <div class="search-section">
      <BaseDashboardCard title="도시 검색" icon="search">
        <SearchBar
          :query="searchCity"
          :region-list="matchingLegalDistrictList"
          @update-query="updateSearchCity"
          @select-region="selectSearchRegion"
        />
      </BaseDashboardCard>
    </div>

    <div class="dashboard-layout">
      <div class="map-column">
        <BaseDashboardCard class="equal-height-card" title="지도 기상 관측" icon="map">
          <WeatherMap
            :weather-list="weatherList"
            :focus-weather="selectedWeatherForMap"
            @select-region="selectMapRegion"
          />
        </BaseDashboardCard>
      </div>

      <div class="information-column">
        <BaseDashboardCard class="equal-height-card" title="지역별 날씨 현황" icon="city">
          <div class="weather-list-scroll">
            <el-skeleton
              v-if="isLoading || isSearchLoading"
              class="api-message"
              :rows="4"
              animated
            />

            <div v-else-if="displayedErrorMessage" class="api-message error-message">
              <el-alert
                :title="displayedErrorMessage"
                type="error"
                :closable="false"
                show-icon
              />
              <el-button type="danger" @click="retryWeather">다시 불러오기</el-button>
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
              v-if="
                !isLoading &&
                !isSearchLoading &&
                !displayedErrorMessage &&
                filteredWeatherList.length === 0
              "
              :description="
                searchCity === ''
                  ? '표시할 날씨 정보가 없습니다.'
                  : matchingLegalDistrictList.length > 0
                    ? '검색창의 전체 주소 목록에서 지역을 선택해 주세요.'
                    : '검색 결과와 일치하는 국내 지역이 없습니다.'
              "
              :image-size="70"
            />
          </div>
        </BaseDashboardCard>
      </div>
    </div>

    <div class="status-box">
      <strong>관측 상태</strong>
      <p v-if="selectedCity"><AppIcon name="pin" :size="17" /> {{ selectedCityMessage }}</p>
      <p v-else>지도 또는 지역별 날씨 카드를 선택해 보세요.</p>
      <p v-if="selectedCity" class="click-count">{{ hotCityClickMessage }}</p>
    </div>
  </main>
</template>

<style scoped>
.weather-view {
  width: 100%;
}

.dashboard-layout {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 18px;
}

.search-section {
  margin-bottom: 18px;
}

.search-section :deep(.dashboard-card) {
  margin-top: 0;
}

.map-column {
  flex: 1.25 1 570px;
}

.information-column {
  flex: 0.8 1 390px;
}

.equal-height-card {
  height: 720px;
}

.weather-list-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 7px 4px 0;
  scrollbar-color: #6cb9dc #deeff7;
  scrollbar-width: thin;
}

.weather-list-scroll::-webkit-scrollbar {
  width: 8px;
}

.weather-list-scroll::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: #deeff7;
}

.weather-list-scroll::-webkit-scrollbar-thumb {
  border: 2px solid #deeff7;
  border-radius: 10px;
  background-color: #3198c8;
}

.map-column > :first-child,
.information-column > :first-child {
  margin-top: 0;
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
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 18px;
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: 8px;
  background-color: rgba(4, 68, 108, 0.9);
  color: #e8f8ff;
  font-size: 15px;
  box-shadow: 0 7px 16px rgba(4, 66, 105, 0.16);
}

.status-box strong {
  padding: 3px 9px;
  border-radius: 4px;
  background-color: #32add5;
  color: white;
  font-size: 12px;
}

.status-box p {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0;
}

.click-count {
  padding-left: 12px;
  border-left: 1px solid rgba(255, 255, 255, 0.35);
  font-size: 14px;
}
</style>
