<script setup>
import { RouterLink } from 'vue-router'
import AppIcon from '../components/exercise/AppIcon.vue'
</script>

<template>
  <main class="not-found-view">
    <section class="not-found-card">
      <p class="not-found-icon"><AppIcon name="alert" :size="48" /></p>
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>요청하신 주소가 존재하지 않거나 아직 개발되지 않았습니다.</p>
      <RouterLink class="home-link" to="/">날씨 메인으로 이동</RouterLink>
    </section>
  </main>
</template>

<style scoped>
.not-found-view {
  display: flex;
  justify-content: center;
  padding: 70px 0;
}

.not-found-card {
  width: 72%;
  padding: 42px 28px;
  border: 1px solid #dfe6eb;
  border-radius: 10px;
  background-color: white;
  color: #71808c;
  text-align: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
}

.not-found-icon {
  margin: 0;
  font-size: 54px;
}

h2 {
  margin: 16px 0 8px;
  color: #263746;
  font-size: 23px;
  font-weight: bold;
}

.home-link {
  display: inline-block;
  margin-top: 20px;
  padding: 9px 18px;
  border-radius: 20px;
  background-color: #168ef0;
  color: white;
  font-weight: bold;
  text-decoration: none;
}
</style>
