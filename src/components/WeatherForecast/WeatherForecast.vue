<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import {fetchEntity} from '@/services/fetchEntity';
import type {CityLocation} from '@/types/CityLocation';
import type {CityWeather} from '@/types/CityWeather';
import WeatherForecastList from '@/components/WeatherForecast/WeatherForecastList.vue';
import AlertModal from '@/components/Modals/AlertModal.vue';

export interface ForecastListItem {
  id: number;
  fetching: boolean;
  cityName: string;
  error: string;
  cityWeather?: CityWeather | null
}

interface State {
  forecastList: Array<ForecastListItem>;
  isAlertModalVisible: boolean;
}

const baseUrl = import.meta.env.VITE_BASE_URL;
const appId = import.meta.env.VITE_OPEN_WEATHER_APP_ID;

const state = reactive<State>({
  forecastList: [{
    id: new Date().getTime(),
    fetching: false,
    cityName: '',
    error: ''
  }],
  isAlertModalVisible: false
});

const getCityForecast = async (lat: number, lon: number): Promise<CityWeather> => {
  return await fetchEntity(`${baseUrl}/data/2.5/weather`, {params: {
    lat,
    lon,
    units: 'metric',
    appid: appId
  }}) as CityWeather;
}

const getCityLatLon = async (cityName: string): Promise<Array<CityLocation>> => {
  return await fetchEntity(`${baseUrl}/geo/1.0/direct`, {params: {
    q: cityName,
    limit: 1,
    appid: appId
  }}) as Array<CityLocation>;
}

const fetchTodayForecast = async (cityName: string): Promise<CityWeather | null> => {
  const cityLocationResponse = await getCityLatLon(cityName);

  if (cityLocationResponse && cityLocationResponse.length > 0) {
    const [cityLatLon] = cityLocationResponse;
    return await getCityForecast(cityLatLon.lat, cityLatLon.lon);
  }

  return null;
}

onMounted(async () => {
  // const cityLocationResponse = await getCityLatLon();

  // if (cityLocationResponse) {
  //   const [cityLatLon] = cityLocationResponse;
  //   const cityWeatherResponse = await getCityWeather(cityLatLon.lat, cityLatLon.lon);
  //   forecastList.value?.push(cityWeatherResponse);
  // }

});

const onChangeCityName = async (name: string, id: number) => {
  const {forecastList} = state;

  const isNameDuplicated = forecastList
    .filter(forecast => forecast.cityName.toLowerCase() === name.toLowerCase()).length > 0;
  const forecast = forecastList.find(forecast => forecast.id === id);
  
  if (forecast) {
    forecast.fetching = true;
    forecast.error = '';
    forecast.cityName = name;

    if (isNameDuplicated) {
      forecast.fetching = false;
      forecast.error = 'City with this name already exists';
      forecast.cityWeather = null;
      return;
    }
    
    const cityWeatherForecast = await fetchTodayForecast(name);

    if (cityWeatherForecast) {
      forecast.cityWeather = cityWeatherForecast;
    } else {
      forecast.error = 'City was not found';
      forecast.cityWeather = null;
    }
    forecast.fetching = false;
  }
}

const addNewForecastCard = () => {
  const MAX_SIZE_LIST = 5;

  if (state.forecastList.length < MAX_SIZE_LIST) {
    state.forecastList.push({
      id: new Date().getTime(),
      fetching: false,
      cityName: '',
      error: ''
    });
  } else {
    state.isAlertModalVisible = true;
  }
}

</script>

<template>
  <WeatherForecastList
    :forecastList="state.forecastList"
    @changeCityName="onChangeCityName"
    @addNewForecastCard="addNewForecastCard"
  />

  <AlertModal
    v-if="state.isAlertModalVisible"
    text="You are not able to add more then 5 items"
    @onClose="state.isAlertModalVisible = false"
  />
</template>