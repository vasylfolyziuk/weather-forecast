<script setup lang="ts">
import WeatherForecastItem from '@/components/WeatherForecast/WeatherForecastItem.vue';
import type { ForecastListItem } from '@/components/WeatherForecast/WeatherForecast.vue';

defineProps<{
  forecastList: Array<ForecastListItem>
}>();

const emit = defineEmits<{
  (e: 'changeForecastCity', name: string, id: number): void,
  (e: 'addForecast'): void,
  (e: 'deleteForecast', id: number): void
}>();

</script>

<template>
  <ul>
    <WeatherForecastItem
      v-for="forecast in forecastList"
      :key="forecast.cityName"
      :forecast="forecast"
      :isLast="forecastList.length === 1"
      @changeForecastCity="(name: string, id: number) => emit('changeForecastCity', name, id)"
      @addForecast="() => emit('addForecast')"
      @deleteForecast="(id: number) => emit('deleteForecast', id)"
    />
  </ul>
</template>