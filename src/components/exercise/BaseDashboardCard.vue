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
  margin-top: 18px;
  padding: 20px;
  border: 1px solid #dfe6eb;
  border-radius: 10px;
  background-color: #f7f9fa;
}

h2 {
  margin: 0 0 10px;
  color: #294b66;
  font-size: 21px;
  font-weight: normal;
}
</style>
