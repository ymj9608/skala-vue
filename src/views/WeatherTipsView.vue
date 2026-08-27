<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="tips-view">
    <section class="tips-card">
      <h2>💡 날씨 생활 팁</h2>
      <div class="tip-list">
        <p>☀️ 더운 날에는 물을 자주 마시고 한낮의 야외 활동을 줄여 보세요.</p>
        <p>🌧️ 비가 오는 날에는 작은 우산과 미끄럼 방지 신발을 준비해 보세요.</p>
        <p>🌬️ 선선한 날에는 가벼운 겉옷을 챙기면 체온 유지에 도움이 됩니다.</p>
      </div>
      <RouterLink class="home-link" to="/">대시보드 홈으로 이동</RouterLink>
    </section>
  </main>
</template>

<style scoped>
.tips-view {
  width: 100%;
}

.tips-card {
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

.tip-list {
  padding: 12px 18px;
  border-radius: 7px;
  background-color: #f1f7fb;
}

.tip-list p {
  margin: 10px 0;
}

.home-link {
  display: block;
  margin-top: 16px;
  padding: 9px;
  border-radius: 4px;
  background-color: #389bd6;
  color: white;
  text-align: center;
  text-decoration: none;
}
</style>
