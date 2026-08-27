<script setup>
import { RouterLink, RouterView } from 'vue-router'
import AppIcon from './components/exercise/AppIcon.vue'
import UnitToggler from './components/exercise/UnitToggler.vue'
import WeatherLogo from './components/exercise/WeatherLogo.vue'
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <RouterLink class="brand-home-link" to="/">
        <WeatherLogo />
      </RouterLink>

      <div class="header-tools">
        <nav>
          <RouterLink to="/">
            <AppIcon name="dashboard" :size="18" />
            날씨 대시보드
          </RouterLink>
          <RouterLink to="/about">
            <AppIcon name="info" :size="18" />
            서비스 소개
          </RouterLink>
          <RouterLink to="/tips">
            <AppIcon name="tips" :size="18" />
            날씨 생활 팁
          </RouterLink>
          <RouterLink to="/community">
            <AppIcon name="community" :size="18" />
            커뮤니티
          </RouterLink>
        </nav>

        <div class="header-settings">
          <UnitToggler />
        </div>
      </div>
    </header>

    <div class="content-area">
      <RouterView />
    </div>

    <footer class="app-footer">
      <strong>SKALA WEATHER SEARCH</strong>
      <span>실시간 기상 데이터와 지도를 활용한 지역 날씨 검색 서비스</span>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  overflow: hidden;
  background-color: rgba(237, 248, 255, 0.96);
  color: #333333;
}

.app-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  min-height: 120px;
  gap: 18px 28px;
  padding: 16px 34px;
  border-bottom: 4px solid #0879ad;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(235, 248, 254, 0.78) 33%, rgba(207, 237, 250, 0.28) 57%, rgba(177, 221, 242, 0.08) 100%),
    url('./assets/sws-cloud-header-v2.png') center 44% / cover no-repeat;
  box-shadow:
    inset 0 -1px rgba(255, 255, 255, 0.55),
    0 7px 18px rgba(1, 62, 101, 0.15);
}

.brand-home-link {
  display: block;
  flex: 0 0 auto;
  border-radius: 14px;
  color: inherit;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    filter 0.2s ease;
}

.brand-home-link:hover {
  transform: translateY(-2px);
  filter: drop-shadow(0 6px 8px rgba(5, 79, 119, 0.16));
}

.header-tools {
  display: flex;
  flex: 1 1 760px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 9px;
}

nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  padding: 7px;
  border: 1px solid rgba(255, 255, 255, 0.34);
  border-radius: 12px;
  background: linear-gradient(120deg, rgba(3, 72, 113, 0.94), rgba(4, 127, 173, 0.9));
  box-shadow: 0 9px 22px rgba(1, 62, 101, 0.2);
  backdrop-filter: blur(8px);
}

nav a {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 12px;
  border-bottom: 2px solid transparent;
  border-radius: 5px;
  color: #dceefa;
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

nav a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

nav a.router-link-exact-active {
  border-bottom-color: #80e4ff;
  background-color: rgba(255, 255, 255, 0.14);
  color: white;
  font-weight: bold;
}

.header-settings {
  padding: 7px 9px;
  border: 1px solid rgba(255, 255, 255, 0.34);
  border-radius: 12px;
  background: linear-gradient(120deg, rgba(3, 72, 113, 0.94), rgba(4, 127, 173, 0.9));
  box-shadow: 0 9px 22px rgba(1, 62, 101, 0.2);
  backdrop-filter: blur(8px);
}

.content-area {
  min-height: 600px;
  padding: 25px 28px 32px;
  background:
    linear-gradient(rgba(16, 112, 160, 0.3), rgba(3, 70, 112, 0.46)),
    url('./assets/sws-ocean-observatory-v2.png') center top / cover fixed;
}

.app-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  padding: 15px 30px;
  border-top: 1px solid #d9e5ec;
  background-color: white;
  color: #6f808a;
  font-size: 12px;
}

.app-footer strong {
  color: #17648f;
}
</style>
