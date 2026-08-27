<script setup>
defineProps({
  query: {
    type: String,
    required: true,
  },
  regionList: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update-query', 'select-region'])
</script>

<template>
  <div class="search-bar">
    <input
      type="text"
      :value="query"
      placeholder="국내 전체 주소 검색 (예: 하안미리, 대화면)"
      @input="emit('update-query', $event.target.value)"
    />
    <p v-if="query && regionList.length > 0">
      검색된 주소 '{{ query }}' 결과 {{ regionList.length }}개
    </p>
    <p v-else-if="query">검색된 주소 '{{ query }}' 결과 0개</p>
    <p v-else>검색어가 없으면 광역자치단체의 날씨를 표시합니다.</p>

    <div v-if="regionList.length > 0" class="region-result-list">
      <button
        v-for="regionName in regionList"
        :key="regionName"
        type="button"
        @click="emit('select-region', regionName)"
      >
        {{ regionName }}
      </button>
    </div>
  </div>
</template>

<style scoped>
input {
  width: 100%;
  height: 46px;
  padding: 8px 15px;
  border: 1px solid #9dc5d8;
  border-radius: 8px;
  background-color: white;
  color: #333333;
  font-size: 16px;
  outline: none;
  box-shadow:
    inset 0 1px 3px rgba(18, 79, 111, 0.08),
    0 3px 9px rgba(17, 85, 120, 0.05);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

input:focus {
  border-color: #1697c9;
  box-shadow: 0 0 0 3px rgba(22, 151, 201, 0.14);
}

p {
  margin: 7px 0 0;
  color: #326985;
  font-size: 14px;
}

.region-result-list {
  max-height: 230px;
  margin-top: 8px;
  overflow-y: auto;
  border: 1px solid #b8d5e3;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 8px 18px rgba(8, 75, 111, 0.12);
  scrollbar-color: #6cb9dc #e6f3f8;
  scrollbar-width: thin;
}

.region-result-list button {
  display: block;
  width: 100%;
  padding: 10px 13px;
  border: 0;
  border-bottom: 1px solid #e2edf2;
  background-color: white;
  color: #245f7d;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
}

.region-result-list button:last-child {
  border-bottom: 0;
}

.region-result-list button:hover {
  background-color: #e9f6fb;
  color: #066b9b;
  font-weight: bold;
}
</style>
