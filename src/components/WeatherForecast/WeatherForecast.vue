<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import {fetchEntity} from '@/services/fetchEntity';
import type {CityLocation} from '@/types/CityLocation';
import type {TodayForecast} from '@/types/TodayForecast.ts';
import type {WeekForecast} from '@/types/WeekForecast.ts';
import type {RangeMode} from '@/types/RangeMode';
import WeatherForecastList from '@/components/WeatherForecast/WeatherForecastList.vue';
import AlertModal from '@/components/Modals/AlertModal.vue';

export interface ForecastListItem {
  id: number;
  fetching: boolean;
  cityName: string;
  error: string;
  rangeMode: RangeMode,
  today?: TodayForecast | null,
  week?: WeekForecast | null,
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
    rangeMode: 'DAY',
    error: ''
  }],
  isAlertModalVisible: false
});

const getCityForecast = async (lat: number, lon: number): Promise<TodayForecast> => {
  return await fetchEntity(`${baseUrl}/data/2.5/weather`, {params: {
    lat,
    lon,
    units: 'metric',
    appid: appId
  }}) as TodayForecast;
}

const get5daysCityForecast = async (lat: number, lon: number): Promise<WeekForecast> => {
  return await fetchEntity(`${baseUrl}/data/2.5/forecast`, {params: {
    lat,
    lon,
    units: 'metric',
    appid: appId
  }}) as WeekForecast;
}

const getCityLatLon = async (cityName: string): Promise<Array<CityLocation>> => {
  return await fetchEntity(`${baseUrl}/geo/1.0/direct`, {params: {
    q: cityName,
    limit: 1,
    appid: appId
  }}) as Array<CityLocation>;
}

const fetchTodayForecast = async (cityName: string): Promise<TodayForecast | null> => {
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
  //   const todayResponse = await getTodayForecast(cityLatLon.lat, cityLatLon.lon);
  //   forecastList.value?.push(todayResponse);
  // }

});

const changeForecastCity = async (name: string, id: number) => {
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
      forecast.today = null;
      return;
    }
    
    const todayForecast = await fetchTodayForecast(name);

    if (todayForecast) {
      forecast.today = todayForecast;
    } else {
      forecast.error = 'City was not found';
      forecast.today = null;
    }
    forecast.fetching = false;
  }
}

const addForecast = () => {
  const MAX_SIZE_LIST = 5;

  if (state.forecastList.length < MAX_SIZE_LIST) {
    state.forecastList.push({
      id: new Date().getTime(),
      fetching: false,
      cityName: '',
      rangeMode: 'DAY',
      error: ''
    });
  } else {
    state.isAlertModalVisible = true;
  }
}

const deleteForecast = (id: number) => {
  if (state.forecastList.length !== 1) {
    state.forecastList = state.forecastList.filter(forecast => forecast.id !== id);
  }
}

const switchRange = async (rangeMode: RangeMode, id: number) => {
  const forecast = state.forecastList.find(forecast => forecast.id === id);

  if (forecast) {
    forecast.rangeMode = rangeMode;

    if (forecast.today) {
      const {lat, lon} = forecast.today.coord;
      const weekForecast = await get5daysCityForecast(lat, lon);
      forecast.week = weekForecast;
    }
  }
}

</script>

<template>
  <WeatherForecastList
    :forecastList="state.forecastList"
    @changeForecastCity="changeForecastCity"
    @addForecast="addForecast"
    @deleteForecast="deleteForecast"
    @switchRange="switchRange"
  />

  <AlertModal
    v-if="state.isAlertModalVisible"
    text="You are not able to add more then 5 items"
    @onClose="() => state.isAlertModalVisible = false"
  />
</template>