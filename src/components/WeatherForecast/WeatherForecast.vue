<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import type {TodayForecast} from '@/types/TodayForecast.ts';
import type {WeekForecast} from '@/types/WeekForecast.ts';
import type {RangeMode} from '@/types/RangeMode';
import WeatherForecastList from '@/components/WeatherForecast/WeatherForecastList.vue';
import AlertModal from '@/components/Modals/AlertModal.vue';
import { useFavorites } from './useFavorites';
import { RouterLink } from 'vue-router';
import { useFetch } from '@/services/useFetch';

export interface ForecastListItem {
  id: number;
  fetching: boolean;
  cityName: string;
  error: string;
  rangeMode: RangeMode;
  today?: TodayForecast | null;
  week?: WeekForecast | null;
}

interface GeolocationCoordinates {
  coords: {
    latitude: number;
    longitude: number
  }
}

interface State {
  forecastList: Array<ForecastListItem>;
  isAddAlertVisible: boolean;
  isAddFavoriteAlertVisible: boolean;
}

const MAX_SIZE_LIST = 2;

const state = reactive<State>({
  forecastList: [{
    id: new Date().getTime(),
    fetching: false,
    cityName: '',
    rangeMode: 'DAY',
    error: ''
  }],
  isAddAlertVisible: false,
  isAddFavoriteAlertVisible: false
});

const {favorites, addToFavorites} = useFavorites();
const {getCityLatLon, getCityForecast, get5daysCityForecast, getTodayForecast} = useFetch();


const fetchForecastByGeolocation = async () => {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (response: GeolocationCoordinates) => {
      const [forecast] = state.forecastList;
      const todayForecast = await getCityForecast(response.coords.latitude, response.coords.longitude);

      if (todayForecast) {
        forecast.today = todayForecast;
        forecast.id = todayForecast.id;
      } else {
        forecast.error = 'City was not found';
        forecast.today = null;
      }
    });
  }
}

onMounted(() => {
  fetchForecastByGeolocation();
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
    
    const todayForecast = await getTodayForecast(name);

    if (todayForecast) {
      forecast.today = todayForecast;
      forecast.id = todayForecast.id;
    } else {
      forecast.error = 'City was not found';
      forecast.today = null;
    }
    forecast.fetching = false;
  }
}

const addForecast = () => {
  if (state.forecastList.length < MAX_SIZE_LIST) {
    state.forecastList.push({
      id: new Date().getTime(),
      fetching: false,
      cityName: '',
      rangeMode: 'DAY',
      error: ''
    });
  } else {
    state.isAddAlertVisible = true;
  }
}

const deleteForecast = (id: number) => {
  if (state.forecastList.length !== 1) {
    state.forecastList = state.forecastList.filter(forecast => forecast.id !== id);
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

const addFavorite = (id: number) => {
  if (favorites.value.length < MAX_SIZE_LIST) {
    const forecast = state.forecastList.find(forecast => forecast.id === id);
    if (forecast) {
      addToFavorites(forecast);
    }
  } else {
    state.isAddFavoriteAlertVisible = true;
  }
}

</script>

<template>
  <WeatherForecastList
    :forecastList="state.forecastList"
    :favorites="favorites"
    @changeForecastCity="changeForecastCity"
    @addForecast="addForecast"
    @deleteForecast="deleteForecast"
    @switchRange="switchRange"
    @addToFavorite="addFavorite"
  />

  <AlertModal
    v-if="state.isAddAlertVisible"
    @onClose="() => state.isAddAlertVisible = false"
  >
    You are not able to add more then {{ MAX_SIZE_LIST }} items to list. 
    <br>Please remove some before adding the new one.
  </AlertModal>

  <AlertModal
    v-if="state.isAddFavoriteAlertVisible"
    @onClose="() => state.isAddFavoriteAlertVisible = false"
  >
    You are not able to add more then {{ MAX_SIZE_LIST }} items to list. 
    <br>
    Please go to 
    <RouterLink
      to="/favorites">
      Favorites
    </RouterLink>
    and remove some forecast before adding the new one.
  </AlertModal>
</template>