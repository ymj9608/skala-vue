<script setup>
import { useConfigStore } from '../../stores/configStore.js'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <p>날씨 단위: {{ configStore.unitSymbol }}</p>
    <el-button type="primary" size="small" @click="configStore.toggleUnit">단위 변경</el-button>
    <el-button type="info" size="small" @click="configStore.toggleWeatherStatus">
      {{ configStore.weatherStatusButtonText }}
    </el-button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 7px;
}

p {
  margin: 0;
  color: #587083;
  white-space: nowrap;
}
</style>
