<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../../stores/configStore.js'
import AppIcon from './AppIcon.vue'

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

const weatherIconUrl = computed(() => {
  return `https://openweathermap.org/img/wn/${props.weather.iconCode || '03d'}@2x.png`
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
    <div class="weather-symbol">
      <img :src="weatherIconUrl" :alt="weather.status" />
    </div>

    <div class="weather-info">
      <h3>
        {{ weather.name }}
        <template v-if="configStore.showWeatherStatus">({{ weather.status }})</template>
      </h3>
      <div class="weather-metrics">
        <p>현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
        <p v-if="weather.humidity !== undefined">습도: {{ weather.humidity }}%</p>
        <p v-if="weather.wind !== undefined">풍속: {{ weather.wind }}m/s</p>
      </div>
      <template v-if="configStore.showWeatherStatus">
        <el-tag v-if="weather.temp >= 25" class="weather-label" type="danger" effect="dark">
          <AppIcon name="hot" :size="14" />
          더움 (25도 이상)
        </el-tag>
        <el-tag v-else class="weather-label" type="primary" effect="dark">
          <AppIcon name="cool" :size="14" />
          선선함 (25도 미만)
        </el-tag>
      </template>
    </div>

    <el-button class="detail-button" type="primary" @click.stop="emit('click-detail', weather)">
      상세보기
      <AppIcon name="arrow" :size="15" />
    </el-button>
  </article>
</template>

<style scoped>
.weather-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 166px;
  min-height: 166px;
  margin-top: 10px;
  padding: 14px 15px;
  border: 1px solid #c7dce8;
  border-left: 4px solid #8bb8ce;
  border-radius: 10px;
  background: linear-gradient(120deg, #ffffff 0%, #f2f9fc 100%);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(20, 91, 129, 0.08);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.weather-card:hover {
  transform: translateY(-2px);
  border-color: #65aeca;
  box-shadow: 0 8px 18px rgba(20, 91, 129, 0.14);
}

.weather-symbol {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  margin-right: 12px;
  border: 1px solid #d4e8f2;
  border-radius: 17px;
  background: linear-gradient(145deg, #ffffff, #e2f2f9);
  box-shadow:
    inset 0 1px 0 white,
    0 5px 12px rgba(28, 103, 142, 0.12);
}

.weather-symbol img {
  width: 72px;
  height: 72px;
  object-fit: contain;
  filter: drop-shadow(0 4px 3px rgba(17, 80, 113, 0.18));
}

.weather-info {
  flex: 1;
  min-width: 0;
}

.weather-info h3,
.weather-metrics p {
  margin: 3px 0;
}

.weather-info h3 {
  display: flex;
  align-items: center;
  min-height: 44px;
  color: #0b557e;
  font-size: 16px;
  font-weight: bold;
  line-height: 1.35;
}

.weather-metrics {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  min-height: 39px;
}

.weather-metrics p {
  margin-right: 8px;
  color: #386c86;
  font-size: 13px;
}

.hot-card {
  border-left-color: #ff7043;
}

.cool-card {
  border-left-color: #1ea7d6;
}

.selected-card {
  border-color: #008dcc;
  background: linear-gradient(105deg, #e2f7ff, #ffffff);
  box-shadow: 0 0 0 2px rgba(0, 141, 204, 0.13);
}

.weather-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.weather-card > .el-button {
  margin-left: 14px;
}

.detail-button :deep(span) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
