<script setup lang="ts">
import WeatherForecastItem from '@/components/WeatherForecast/WeatherForecastItem.vue';
import type { CityWeather } from '@/types/CityWeather';

const props = defineProps<{
  forecastList: Array<CityWeather>
}>();
</script>

<template>
  <ul>
    <WeatherForecastItem
      v-for="weatherForecast in forecastList"
      :key="weatherForecast.id"
      :weatherForecast="weatherForecast"
    />
  </ul>
</template>