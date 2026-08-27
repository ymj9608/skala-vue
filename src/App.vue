<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <h1>🌤️ 종합실습 8: Weather Deployment</h1>

      <div class="navigation-area">
        <nav>
          <RouterLink to="/">🌦️ 날씨 대시보드</RouterLink>
          <RouterLink to="/about">ℹ️ 서비스 소개</RouterLink>
          <RouterLink to="/tips">💡 날씨 생활 팁</RouterLink>
        </nav>

        <UnitToggler />
      </div>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
.app-shell {
  width: 80%;
  max-width: 880px;
  min-height: calc(100vh - 32px);
  margin: 16px auto;
  padding: 34px 5%;
  border: 1px solid #eeeeee;
  border-radius: 18px;
  background-color: white;
  color: #333333;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.05);
}

h1 {
  margin: 0;
  padding: 0 4px 20px;
  border-bottom: 1px solid #e1e5e8;
  color: #17334a;
  font-size: 28px;
  font-weight: bold;
}

.navigation-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 18px;
  padding: 14px;
  border-radius: 8px;
  background-color: #f7f9fa;
}

nav {
  display: flex;
  justify-content: center;
  gap: 10px;
}

nav a {
  padding: 3px 10px;
  border-bottom: 2px solid transparent;
  color: #587083;
  text-decoration: none;
}

nav a.router-link-exact-active {
  border-bottom-color: #42a5f5;
  color: #2688c4;
  font-weight: bold;
}
</style>
