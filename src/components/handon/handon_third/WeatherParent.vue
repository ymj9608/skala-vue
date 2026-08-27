<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import WeatherStatus from './WeatherStatus.vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '대전', temp: 23, status: '흐림' },
])
const searchCity = ref('')
const selectedCity = ref('')
const hotCityClickCount = ref(0)

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
  window.alert(`${weather.name}의 현재 날씨는 [${weather.status}] 상태입니다.`)
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
</script>

<template>
  <main class="weather-page">
    <div class="weather-container">
      <h1>과제 3: 날씨 컴포넌트 분리 (Mockup)</h1>

      <BaseDashboardCard title="도시 검색" icon="🔍">
        <SearchBar :query="searchCity" @update-query="updateSearchCity" />
      </BaseDashboardCard>

      <BaseDashboardCard title="지역별 날씨 현황" icon="🏙️">
        <WeatherCard
          v-for="weather in filteredWeatherList"
          :key="weather.id"
          :weather="weather"
          :is-selected="selectedCity === weather.name"
          @select-card="selectCity"
          @click-detail="showDetail"
        />

        <p v-if="filteredWeatherList.length === 0" class="no-result">
          검색 결과와 일치하는 도시가 없습니다.
        </p>
      </BaseDashboardCard>

      <WeatherStatus :selected-city="selectedCity" :hot-city-click-message="hotCityClickMessage" />
    </div>
  </main>
</template>

<style scoped>
.weather-page {
  position: relative;
  min-height: 100vh;
  padding: 1px 0;
  overflow: hidden;
}

.weather-container {
  position: relative;
  z-index: 1;
  width: 80%;
  max-width: 880px;
  margin: 16px auto;
  padding: 40px 5% 35px;
  border: 1px solid #eeeeee;
  border-radius: 20px;
  background-color: white;
  color: #333333;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.05);
}

h1 {
  margin: 0 0 32px;
  padding: 0 4px 22px;
  border-bottom: 1px solid #e1e5e8;
  color: #17334a;
  font-size: 30px;
  font-weight: bold;
}

.no-result {
  margin-top: 14px;
  padding: 25px;
  border: 1px solid #dddddd;
  border-radius: 8px;
  background-color: white;
  color: #777777;
  text-align: center;
}
</style>
