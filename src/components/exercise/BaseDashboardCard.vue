<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="dashboard-card">
    <h2>
      <span class="heading-icon"><AppIcon v-if="icon" :name="icon" :size="19" /></span>
      {{ title }}
    </h2>
    <slot />
  </section>
</template>

<style scoped>
.dashboard-card {
  display: flex;
  flex-direction: column;
  margin-top: 18px;
  overflow: hidden;
  padding: 0 16px 16px;
  border: 1px solid rgba(16, 96, 143, 0.3);
  border-radius: 10px;
  background-color: rgba(244, 251, 255, 0.96);
  box-shadow: 0 8px 18px rgba(7, 73, 115, 0.15);
}

h2 {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0 -16px 14px;
  padding: 11px 16px;
  border-bottom: 1px solid #1b81b3;
  background: linear-gradient(90deg, #0a5f91, #158bbd);
  color: white;
  font-size: 17px;
  font-weight: bold;
}

.heading-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 29px;
  height: 29px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.12);
}
</style>
