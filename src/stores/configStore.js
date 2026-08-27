import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius')
  const showWeatherStatus = ref(true)

  const unitSymbol = computed(() => {
    if (unit.value === 'fahrenheit') {
      return '°F'
    }

    return '°C'
  })

  const weatherStatusButtonText = computed(() => {
    if (showWeatherStatus.value) {
      return '날씨 상태 숨기기'
    }

    return '날씨 상태 표시'
  })

  function toggleUnit() {
    if (unit.value === 'celsius') {
      unit.value = 'fahrenheit'
    } else {
      unit.value = 'celsius'
    }
  }

  function toggleWeatherStatus() {
    showWeatherStatus.value = !showWeatherStatus.value
  }

  return {
    unit,
    showWeatherStatus,
    unitSymbol,
    weatherStatusButtonText,
    toggleUnit,
    toggleWeatherStatus,
  }
})
