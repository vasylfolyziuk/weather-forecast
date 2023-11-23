<script setup lang="ts">
import { inject, onMounted, reactive, ref } from 'vue';
import ApiService from '@/services/ApiService';
import {useFetch} from '@/services/useFetch';
import {fetchEntity} from '@/services/fetchEntity';
import {CityLocation} from '@/types/CityLocation';
import {CityWeather} from '@/types/CityWeather';
import WeatherForecastList from '@/components/WeatherForecast/WeatherForecastList.vue';


const baseUrl = import.meta.env.VITE_BASE_URL;
const appId = import.meta.env.VITE_OPEN_WEATHER_APP_ID;

const cityName = ref<string>('London');
// const weather = ref<CityWeather>();
const forecastList = ref<Array<CityWeather>>([]);

const getCityWeather = async (lat: number, lon: number): Promise<CityWeather> => {
  return await fetchEntity(`${baseUrl}/data/2.5/weather`, {params: {
    lat,
    lon,
    appid: appId
  }}) as CityWeather;
}

const getCityLatLon = async (): Promise<Array<CityLocation>> => {
  return await fetchEntity(`${baseUrl}/geo/1.0/direct`, {params: {
    q: cityName.value,
    limit: 1,
    appid: appId
  }}) as Array<CityLocation>;
}

onMounted(async () => {
  const cityLocationResponse = await getCityLatLon();

  if (cityLocationResponse) {
    const [cityLatLon] = cityLocationResponse;
    const cityWeatherResponse = await getCityWeather(cityLatLon.lat, cityLatLon.lon);
    forecastList.value?.push(cityWeatherResponse);
  }
});

</script>

<template>
  <WeatherForecastList
    :forecastList="forecastList"
  />
</template>