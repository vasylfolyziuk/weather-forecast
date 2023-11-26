<script setup lang="ts">
import WeatherForecastItem from '@/components/WeatherForecast/WeatherForecastItem.vue';
import type { ForecastListItem } from './WeatherForecast.vue';

const props = defineProps<{
  forecastList: Array<ForecastListItem>
}>();

const emit = defineEmits<{
  (e: 'changeCityName', name: string, id: number): void,
  (e: 'addNewForecastCard'): void
}>();

const onChangeCity = (name: string, id: number) => {
  emit('changeCityName', name, id);
}

const addNewForecastCard = () => {
  emit('addNewForecastCard');
}

</script>

<template>
  <ul>
    <WeatherForecastItem
      v-for="forecast in forecastList"
      :key="forecast.cityName"
      :forecast="forecast"
      @changeCityName="onChangeCity"
      @addNewForecastCard="addNewForecastCard"
    />
  </ul>
</template>