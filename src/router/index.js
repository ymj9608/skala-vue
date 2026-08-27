import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'weather-home',
      component: () => import('../views/WeatherHomeView.vue'),
    },
    {
      path: '/about',
      name: 'weather-about',
      component: () => import('../views/WeatherAboutView.vue'),
    },
    {
      path: '/weather/:cityId',
      name: 'weather-detail',
      component: () => import('../views/WeatherDetailView.vue'),
    },
    {
      path: '/map-weather/:lat/:lon',
      name: 'map-weather-detail',
      component: () => import('../views/MapWeatherDetailView.vue'),
    },
    {
      path: '/tips',
      name: 'weather-tips',
      component: () => import('../views/WeatherTipsView.vue'),
    },
    {
      path: '/community',
      name: 'weather-community',
      component: () => import('../views/WeatherCommunityView.vue'),
    },
    {
      path: '/community/write',
      name: 'weather-community-write',
      component: () => import('../views/WeatherCommunityWriteView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
