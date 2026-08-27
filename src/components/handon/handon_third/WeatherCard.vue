<script setup>
defineProps({
  weather: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <article
    :class="[
      'weather-card',
      weather.temp >= 25 ? 'hot-card' : 'cool-card',
      isSelected ? 'selected-card' : '',
    ]"
    @click="emit('select-card', weather)"
  >
    <div class="weather-info">
      <h3>{{ weather.name }} ({{ weather.status }})</h3>
      <p>현재 기온: {{ weather.temp }}°C</p>

      <p v-if="weather.temp >= 25" class="weather-label hot-label">🔥 더움 (25도 이상)</p>
      <p v-else class="weather-label cool-label">❄️ 선선함 (25도 미만)</p>
    </div>

    <button type="button" @click.stop="emit('click-detail', weather)">상세보기</button>
  </article>
</template>

<style scoped>
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

.weather-info h3,
.weather-info p {
  margin: 4px 0;
}

.weather-info h3 {
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

.weather-label {
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
</style>
