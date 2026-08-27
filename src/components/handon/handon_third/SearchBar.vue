<script setup>
defineProps({
  query: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])
</script>

<template>
  <div class="search-bar">
    <input
      type="text"
      :value="query"
      placeholder="검색할 도시 이름 입력"
      @input="emit('update-query', $event.target.value)"
    />
    <p>검색 중인 도시: {{ query }}</p>
  </div>
</template>

<style scoped>
input {
  width: 100%;
  height: 43px;
  padding: 8px 12px;
  border: 1px solid #999999;
  background-color: white;
  color: #333333;
  font-size: 16px;
}

p {
  margin: 3px 0 0;
  color: #294b66;
  font-size: 17px;
}
</style>
