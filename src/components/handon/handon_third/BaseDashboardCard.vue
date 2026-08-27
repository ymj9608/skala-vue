<script setup>
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
    <h2>{{ icon }} {{ title }}</h2>
    <slot />
  </section>
</template>

<style scoped>
.dashboard-card {
  margin-top: 20px;
  padding: 24px;
  border: 1px solid #e1e5e8;
  border-radius: 11px;
  background-color: #f7f9fa;
}

h2 {
  margin: 0 0 10px;
  color: #294b66;
  font-size: 22px;
  font-weight: normal;
}
</style>
