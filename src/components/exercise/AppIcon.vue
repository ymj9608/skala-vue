<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 20,
  },
})
</script>

<template>
  <svg
    class="app-icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <template v-if="name === 'dashboard'">
      <path d="M4 13.2a8 8 0 1 1 16 0" />
      <path d="M12 5.2v2.1M5.9 8.1l1.5 1.5M18.1 8.1l-1.5 1.5M4 13.2h2.1M17.9 13.2H20" />
      <path d="m12 13.2 4-3" />
      <circle cx="12" cy="13.2" r="1.5" />
      <path d="M6 18.8h12" />
    </template>
    <template v-else-if="name === 'info'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10.7v6M12 7.2h.01" />
    </template>
    <template v-else-if="name === 'tips'">
      <path d="M8.1 14.8c-1.1-.9-1.8-2.3-1.8-3.9a5.7 5.7 0 1 1 9.6 4.1c-.8.7-1.2 1.4-1.3 2.2H9.4c-.1-.9-.5-1.7-1.3-2.4Z" />
      <path d="M9.5 20h5M10 17.2h4" />
    </template>
    <template v-else-if="name === 'map'">
      <path d="m3.5 5.4 5-2.1 7 2.4 5-2.1v15l-5 2.1-7-2.4-5 2.1v-15Z" />
      <path d="M8.5 3.3v15M15.5 5.7v15" />
      <circle cx="12" cy="10.5" r="2.1" />
      <path d="M12 12.6c1.4-1.4 2.1-2.5 2.1-3.5A2.1 2.1 0 0 0 12 7a2.1 2.1 0 0 0-2.1 2.1c0 1 .7 2.1 2.1 3.5Z" />
    </template>
    <template v-else-if="name === 'search'">
      <circle cx="10.8" cy="10.8" r="6.5" />
      <path d="m15.7 15.7 4.1 4.1" />
    </template>
    <template v-else-if="name === 'city'">
      <path d="M4 21V8h7v13M11 21V3h9v18M2 21h20" />
      <path d="M7 11h1M7 14h1M7 17h1M14 7h2M14 11h2M14 15h2" />
    </template>
    <template v-else-if="name === 'pin'">
      <path d="M12 21s7-5.6 7-12A7 7 0 1 0 5 9c0 6.4 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.3" />
    </template>
    <template v-else-if="name === 'hot'">
      <path d="M13.2 3.5c.6 3.1-1.6 4.2-2.7 6.2-.8 1.4-.3 2.7.8 3.5-.1-1.7 1-2.8 2.2-3.8 1.9 1.7 3.2 3.5 3.2 5.8a4.7 4.7 0 0 1-9.4 0c0-3 1.8-5.2 5.9-11.7Z" />
    </template>
    <template v-else-if="name === 'cool'">
      <path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6" />
      <path d="m9.5 4.3 2.5 2 2.5-2M9.5 19.7l2.5-2 2.5 2M4.3 10.1l3-.5.7-2.9M19.7 13.9l-3 .5-.7 2.9M4.3 13.9l3 .5.7 2.9M19.7 10.1l-3-.5-.7-2.9" />
    </template>
    <template v-else-if="name === 'arrow'">
      <path d="M5 12h14M14 7l5 5-5 5" />
    </template>
    <template v-else-if="name === 'chart'">
      <path d="M4 20V9M10 20V4M16 20v-7M22 20H2" />
      <path d="m4 7 6-4 6 7 5-5" />
    </template>
    <template v-else-if="name === 'clock'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </template>
    <template v-else-if="name === 'leaf'">
      <path d="M19.8 4.2C12 4 6.2 7.2 5 12.2c-.8 3.4 1.6 6.5 5.1 6.7 5 .2 8.3-5.5 9.7-14.7Z" />
      <path d="M4 20c2.7-5.2 6.5-8.6 11.5-10.8" />
    </template>
    <template v-else-if="name === 'rain'">
      <path d="M7 15.5h10a4 4 0 0 0 .2-8 5.8 5.8 0 0 0-10.8 1.7A3.2 3.2 0 0 0 7 15.5Z" />
      <path d="m8.5 18-1 2M13 18l-1 2M17.5 18l-1 2" />
    </template>
    <template v-else-if="name === 'wind'">
      <path d="M3 8h11.5a2.5 2.5 0 1 0-2.3-3.5M3 12h16a2 2 0 1 1-1.8 2.9M3 16h8.5" />
    </template>
    <template v-else-if="name === 'alert'">
      <path d="M12 3 2.8 20h18.4L12 3Z" />
      <path d="M12 9v5M12 17h.01" />
    </template>
    <template v-else-if="name === 'community'">
      <circle cx="8.2" cy="8.2" r="3.2" />
      <circle cx="16.8" cy="9.4" r="2.6" />
      <path d="M2.8 19c.4-3.7 2.2-5.8 5.4-5.8s5 2.1 5.4 5.8M14 14.5c.8-.8 1.7-1.1 2.8-1.1 2.7 0 4.2 1.8 4.4 4.8" />
    </template>
    <template v-else-if="name === 'write'">
      <path d="M4 20h4l11-11a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="m13.8 6.2 4 4M4 20l4-4" />
    </template>
  </svg>
</template>

<style scoped>
.app-icon {
  display: inline-block;
  flex: 0 0 auto;
  overflow: visible;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  vertical-align: middle;
}
</style>
