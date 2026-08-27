<template>
  <div class="weather-logo">
    <img class="logo-mark" src="../../assets/sws-radar-search-mark.png" alt="" />

    <div class="logo-type">
      <span class="logo-skala">SKALA</span>
      <strong>WEATHER</strong>
      <span class="logo-search">SEARCH</span>
    </div>
  </div>
</template>

<style scoped>
.weather-logo {
  display: flex;
  align-items: center;
  gap: 18px;
}

.logo-mark {
  width: 88px;
  height: 88px;
  flex: 0 0 auto;
  border: 3px solid rgba(255, 255, 255, 0.92);
  border-radius: 23px;
  object-fit: cover;
  box-shadow:
    0 10px 24px rgba(2, 61, 111, 0.2),
    inset 0 0 0 1px rgba(90, 207, 255, 0.3);
}

.logo-type {
  display: flex;
  flex-direction: column;
  min-width: 245px;
  line-height: 0.86;
  filter: drop-shadow(0 2px 1px rgba(255, 255, 255, 0.85));
}

.logo-type strong {
  background: linear-gradient(180deg, #0751a7 0%, #148edc 58%, #00bce9 100%);
  background-clip: text;
  color: transparent;
  font-size: 38px;
  font-weight: 900;
  letter-spacing: -1.8px;
  -webkit-background-clip: text;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.68);
}

.logo-skala,
.logo-search {
  color: #062f68;
  font-weight: 900;
  letter-spacing: 8px;
}

.logo-skala {
  margin-bottom: 6px;
  font-size: 17px;
}

.logo-search {
  margin-top: 7px;
  font-size: 15px;
  letter-spacing: 10.5px;
}
</style>
