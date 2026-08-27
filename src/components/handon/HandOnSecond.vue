<script setup>
import { computed, ref, watch, watchEffect } from 'vue'

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

const selectCity = (weather) => {
  selectedCity.value = weather.name

  if (weather.temp >= 25) {
    hotCityClickCount.value++
  }
}

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
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
  <div class="weather-page">
    <div class="weather-container">
      <h1>과제 2: 도시 검색 (Mockup)</h1>

      <div class="box">
        <h2>도시 검색</h2>
        <input
          type="text"
          :value="searchCity"
          placeholder="검색할 도시 이름 입력"
          @input="(e) => (searchCity = e.target.value)"
        />
        <p>검색 중인 도시: {{ searchCity }}</p>
      </div>

      <div class="box">
        <h2>지역별 날씨 현황</h2>

        <div
          v-for="weather in filteredWeatherList"
          :key="weather.id"
          :class="[
            'weather-card',
            weather.temp >= 25 ? 'hot-card' : 'cool-card',
            selectedCity === weather.name ? 'selected-card' : '',
          ]"
          @click="selectCity(weather)"
        >
          <div class="weather-info">
            <h3>{{ weather.name }} ({{ weather.status }})</h3>
            <p>현재 기온: {{ weather.temp }}°C</p>

            <p v-if="weather.temp >= 25" class="hot-label">🔥 더움 (25도 이상)</p>
            <p v-else class="cool-label">❄️ 선선함 (25도 미만)</p>
          </div>

          <button type="button" @click.stop="showDetail(weather.name, weather.status)">
            상세보기
          </button>
        </div>

        <p v-if="filteredWeatherList.length === 0" class="no-result">
          검색 결과와 일치하는 도시가 없습니다.
        </p>
      </div>

      <div class="status-box">
        <p v-if="selectedCity">{{ selectedCity }}이 선택되었습니다.</p>
        <p v-else>카드를 클릭하거나 검색해 보세요.</p>

        <div v-if="selectedCity" class="click-status">
          <p>{{ hotCityClickMessage }}</p>
        </div>
      </div>
    </div>
  </div>
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

.box {
  margin-top: 20px;
  padding: 24px;
  border: 1px solid #e1e5e8;
  border-radius: 11px;
  background-color: #f7f9fa;
}

.box h2 {
  margin: 0 0 6px;
  color: #294b66;
  font-size: 22px;
  font-weight: normal;
}

input {
  width: 100%;
  height: 43px;
  padding: 8px 12px;
  border: 1px solid #999999;
  background-color: white;
  color: #333333;
  font-size: 16px;
}

.box > p {
  margin: 3px 0 0;
  color: #294b66;
  font-size: 17px;
}

.no-result {
  margin-top: 14px;
  padding: 25px;
  border: 1px solid #dddddd;
  border-radius: 8px;
  background-color: white;
  text-align: center;
}

.weather-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 128px;
  margin-top: 14px;
  padding: 16px;
  border: 2px solid #e0e5e8;
  border-radius: 9px;
  background-color: white;
  cursor: pointer;
}

.weather-card h3,
.weather-card p {
  margin: 4px 0;
}

.weather-card h3 {
  color: #284f6b;
  font-size: 18px;
  font-weight: normal;
}

.weather-info > p {
  color: #28516e;
  font-size: 16px;
}

.hot-card {
  border-left-color: #ff6b6b;
}

.cool-card {
  border-left-color: #4db7f5;
}

.selected-card {
  border-color: #42a5f5;
  background-color: #f7fbff;
}

.hot-label,
.cool-label {
  display: inline-block;
  padding: 6px 11px;
  border-radius: 5px;
  color: white;
  font-size: 14px;
}

.hot-label {
  background-color: #ff6b6b;
}

.cool-label {
  background-color: #4db7f5;
}

button {
  flex-shrink: 0;
  margin-left: auto;
  padding: 9px 14px;
  border: 1px solid #999999;
  background-color: white;
  color: #28465c;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
}

.status-box {
  margin-top: 20px;
  padding: 14px;
  border-radius: 8px;
  background-color: #e3f6e8;
  color: #008c3a;
  font-size: 17px;
  font-weight: bold;
  text-align: center;
}

.status-box p {
  margin: 0;
}

.click-status {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #b8ddc4;
}

.click-status p {
  margin: 2px 0;
  font-size: 14px;
}
</style>
