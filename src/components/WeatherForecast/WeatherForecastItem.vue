<script setup lang="ts">
import type { CityWeather } from '@/types/CityWeather';

const props = defineProps<{
  weatherForecast: CityWeather
}>();
</script>

<template>
  <li class="card">
    <div class="card-left-side">
      <h2>Weather Today in {{ weatherForecast.name }}</h2>
      <div class="card-header">
        <span>Feels like:</span>
        <div class="feels-like-deg">{{ weatherForecast.main.feels_like }}&deg;</div>
      </div>
      <div class="card-content">
        <div class="card-content-data">
          <div class="card-content-data-left">
            <div class="card-content-data-item">
              Temp
              <span>{{ weatherForecast.main.temp }}&deg;</span>
            </div>
            <div class="card-content-data-item">
              Temp min
              <span>{{ weatherForecast.main.temp_min }}&deg;</span>
            </div>
            <div class="card-content-data-item">
              Temp max
              <span>
                {{ weatherForecast.main.temp_max }}&deg;
              </span>
            </div>
          </div>
          <div class="card-content-data-right">
            <div class="card-content-data-item">
              Pressure
              <span>{{ weatherForecast.main.pressure }}</span>
            </div>
            <div class="card-content-data-item">
              Humidity
              <span>{{ weatherForecast.main.humidity }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card-right-side">
      <button>+</button>
      <button>-</button>
    </div>
  </li>
</template>

<style scoped>
.card {
  display: flex;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  box-shadow: 0 0 12px 0 rgba(0,0,0,.2);
  background-color: var(--color-background-card);
}
.card-left-side {
  flex: 1;
}
.card-right-side {
  flex: 0 0 100px;
}
.card-header {
  padding: 0 1rem;
}
.feels-like-deg {
  font-size: 2rem;
  font-weight: 600;
}
.card-content {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
}
.card-content-data {
  display: flex;
  flex: 1;
}
.card-content-data-left, .card-content-data-right {
  flex: 1;
  margin-right: 3rem;
}
.card-content-data-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  border-bottom: 1px solid grey;
}
</style>