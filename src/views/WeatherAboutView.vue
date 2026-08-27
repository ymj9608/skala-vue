<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="about-view">
    <section class="about-card">
      <h2>ℹ️ 서비스 소개</h2>
      <p>Vue 3와 Vue Router를 이용해 제작한 지역별 날씨 대시보드입니다.</p>
      <ul>
        <li>도시 이름을 입력하여 원하는 지역 검색</li>
        <li>날씨 카드를 선택하여 현재 상태 확인</li>
        <li>상세보기에서 지역별 기상 관측 정보 확인</li>
      </ul>
      <RouterLink class="home-link" to="/">대시보드 홈으로 이동</RouterLink>
    </section>
  </main>
</template>

<style scoped>
.about-view {
  width: 100%;
}

.about-card {
  margin-top: 18px;
  padding: 22px;
  border: 1px solid #dfe6eb;
  border-radius: 10px;
  background-color: white;
  color: #35495e;
}

h2 {
  margin: 0 0 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid #dfe6eb;
  color: #294b66;
  font-size: 21px;
  font-weight: normal;
}

ul {
  margin: 16px 0;
  padding-left: 22px;
}

.home-link {
  display: block;
  padding: 9px;
  border-radius: 4px;
  background-color: #389bd6;
  color: white;
  text-align: center;
  text-decoration: none;
}
</style>
