<script setup lang="ts">
import WeatherForecastItem from '@/components/WeatherForecast/WeatherForecastItem.vue';
import type { ForecastListItem } from './WeatherForecast.vue';

const props = defineProps<{
  forecastList: Array<ForecastListItem>
}>();

const emit = defineEmits<{
  (e: 'changeCityName', name: string, id: number): void
}>();

const onChangeCity = (name: string, id: number) => {
  emit('changeCityName', name, id);
}

</script>

<template>
  <ul>
    <WeatherForecastItem
      v-for="forecast in forecastList"
      :key="forecast.cityName"
      :forecast="forecast"
      @changeCityName="onChangeCity"
    />
  </ul>
</template>