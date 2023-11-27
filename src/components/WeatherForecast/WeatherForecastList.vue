<script setup lang="ts">
import type { RangeMode } from '@/types/RangeMode';
import WeatherForecastItem from '@/components/WeatherForecast/WeatherForecastItem.vue';
import type { ForecastListItem } from '@/components/WeatherForecast/WeatherForecast.vue';

defineProps<{
  forecastList: Array<ForecastListItem>
}>();

const emit = defineEmits<{
  (e: 'changeForecastCity', name: string, id: number): void,
  (e: 'addForecast'): void,
  (e: 'deleteForecast', id: number): void,
  (e: 'switchRange', rangeMode: RangeMode, id: number): void
}>();

</script>

<template>
  <ul>
    <WeatherForecastItem
      v-for="forecast in forecastList"
      :key="forecast.cityName"
      :forecast="forecast"
      :isLast="forecastList.length === 1"
      @changeForecastCity="(name, id) => emit('changeForecastCity', name, id)"
      @addForecast="() => emit('addForecast')"
      @deleteForecast="(id) => emit('deleteForecast', id)"
      @switchRange="(range, id) => emit('switchRange', range, id)"
    />
  </ul>
</template>