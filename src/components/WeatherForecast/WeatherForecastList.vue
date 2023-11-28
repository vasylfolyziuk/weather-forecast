<script setup lang="ts">
import type { RangeMode } from '@/types/RangeMode';
import WeatherForecastItem from '@/components/WeatherForecast/WeatherForecastItem.vue';
import type { ForecastListItem } from '@/components/WeatherForecast/WeatherForecast.vue';
import type { Favorite } from './useFavorites';

const props = defineProps<{
  forecastList: Array<ForecastListItem>,
  favorites: Array<Favorite>
}>();

const emit = defineEmits<{
  (e: 'changeForecastCity', name: string, id: number): void,
  (e: 'addForecast'): void,
  (e: 'deleteForecast', id: number): void,
  (e: 'switchRange', rangeMode: RangeMode, id: number): void,
  (e: 'addToFavorite', id: number): void
}>();

const isFavoritesView = window.location.pathname === '/favorites';

</script>

<template>
  <ul>
    <li v-if="forecastList.length === 0" class="no-forecast-items">
      No weather forecast yet
    </li>
    <WeatherForecastItem
      v-for="(forecast, index) in forecastList"
      :key="forecast.id"
      :forecast="forecast"
      :isFavoritesView="isFavoritesView"
      :isSingle="forecastList.length === 1"
      :isLast="index === (forecastList.length - 1)"
      :favorites="favorites"
      @changeForecastCity="(name, id) => emit('changeForecastCity', name, id)"
      @addForecast="() => emit('addForecast')"
      @deleteForecast="(id) => emit('deleteForecast', id)"
      @switchRange="(range, id) => emit('switchRange', range, id)"
      @addToFavorite="(id) => emit('addToFavorite', id)"
    />
  </ul>
</template>

<style>
.no-forecast-items {
  padding: 1rem;
  text-align: center;
  background-color: #fff;
}
</style>