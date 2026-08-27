<script setup>
defineProps({
  selectedCity: {
    type: String,
    required: true,
  },
  hotCityClickMessage: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="status-box">
    <p v-if="selectedCity">{{ selectedCity }}이 선택되었습니다.</p>
    <p v-else>카드를 클릭하거나 검색해 보세요.</p>
    <p v-if="selectedCity" class="click-count">{{ hotCityClickMessage }}</p>
  </div>
</template>

<style scoped>
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

p {
  margin: 0;
}

.click-count {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #b8ddc4;
  font-size: 14px;
}
</style>
