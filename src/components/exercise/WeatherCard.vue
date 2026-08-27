<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore.js'

const props = defineProps({
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
const configStore = useConfigStore()

const displayTemp = computed(() => {
  const rawTemp = props.weather.temp

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
})
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
      <h3>
        {{ weather.name }}
        <template v-if="configStore.showWeatherStatus">({{ weather.status }})</template>
      </h3>
      <p>현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
      <p v-if="weather.humidity !== undefined">습도: {{ weather.humidity }}%</p>
      <p v-if="weather.wind !== undefined">풍속: {{ weather.wind }}m/s</p>
      <template v-if="configStore.showWeatherStatus">
        <el-tag v-if="weather.temp >= 25" class="weather-label" type="danger" effect="dark">
          🔥 더움 (25도 이상)
        </el-tag>
        <el-tag v-else class="weather-label" type="primary" effect="dark">
          ❄️ 선선함 (25도 미만)
        </el-tag>
      </template>
    </div>

    <el-button type="primary" plain @click.stop="emit('click-detail', weather)">
      상세보기
    </el-button>
  </article>
</template>

<style scoped>
.weather-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 118px;
  margin-top: 12px;
  padding: 15px;
  border: 2px solid #e0e5e8;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
}

.weather-info h3,
.weather-info p {
  margin: 3px 0;
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
  margin-top: 4px;
}

.weather-card > .el-button {
  margin-left: 20px;
}
</style>
