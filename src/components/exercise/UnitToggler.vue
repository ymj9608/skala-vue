<script setup>
import { useConfigStore } from '../../stores/configStore.js'
import AppIcon from './AppIcon.vue'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <p>날씨 단위: {{ configStore.unitSymbol }}</p>
    <el-button type="primary" size="small" @click="configStore.toggleUnit">
      단위 변경
      <AppIcon name="arrow" :size="14" />
    </el-button>
    <el-button class="status-button" size="small" @click="configStore.toggleWeatherStatus">
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
  color: #e8f6ff;
  white-space: nowrap;
}

.unit-toggler :deep(.el-button span) {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.status-button {
  --el-button-bg-color: rgba(255, 255, 255, 0.14);
  --el-button-border-color: rgba(255, 255, 255, 0.48);
  --el-button-text-color: white;
  --el-button-hover-bg-color: rgba(255, 255, 255, 0.24);
  --el-button-hover-border-color: white;
  --el-button-hover-text-color: white;
}
</style>
