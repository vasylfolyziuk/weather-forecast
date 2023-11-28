<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useFetch } from '@/services/useFetch';
import WeatherForecastList from '../WeatherForecast/WeatherForecastList.vue';
import { useFavorites } from '../WeatherForecast/useFavorites';
import type { ForecastListItem } from '../WeatherForecast/WeatherForecast.vue';
import axios from 'axios';
import type { TodayForecast } from '@/types/TodayForecast';
import type { RangeMode } from '@/types/RangeMode';

interface State {
  forecastList: Array<ForecastListItem>;
}

const state = reactive<State>({
  forecastList: []
});

const {favorites, addToFavorites, deleteFavorite} = useFavorites();
const {getCityLatLon, getCityForecast, get5daysCityForecast} = useFetch();

const fetchForecasts = async () => {
  if (favorites.value.length > 0) {
    const promises = favorites.value.map(favorite => getCityForecast(favorite.coords.lat, favorite.coords.lon));

    try {
      const forecasts: Array<TodayForecast> = await axios.all(promises);

      state.forecastList = forecasts.map(forecast => ({
        id: forecast.id,
        fetching: false,
        cityName: forecast.name,
        rangeMode: 'DAY',
        error: '',
        today: forecast
      }));
      
    } catch (error: any) {
      console.log(error);
    }
  }
}

const switchRange = async (rangeMode: RangeMode, id: number) => {
  const forecast = state.forecastList.find(forecast => forecast.id === id);

  if (forecast?.today) {
    forecast.fetching = true;  
    forecast.rangeMode = rangeMode;

    const {lat, lon} = forecast.today.coord;
    const weekForecast = await get5daysCityForecast(lat, lon);
    
    forecast.week = weekForecast;
    forecast.fetching = false;
  }
}

const deleteForecast = (id: number) => {
  deleteFavorite(id);
  state.forecastList = state.forecastList.filter(forecast => forecast.id !== id);
}

onMounted(() => {
  fetchForecasts();
});

</script>

<template>
  <WeatherForecastList
    :forecastList="state.forecastList"
    :favorites="favorites"
    @switchRange="switchRange"
    @deleteForecast="deleteForecast"
  />
</template>
