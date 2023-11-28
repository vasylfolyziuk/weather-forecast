import { ref } from 'vue';
import axios, { type AxiosRequestConfig } from "axios";
import { fetchEntity } from './fetchEntity';
import type { TodayForecast } from '@/types/TodayForecast';
import type { WeekForecast } from '@/types/WeekForecast';
import type { CityLocation } from '@/types/CityLocation';

const baseUrl = import.meta.env.VITE_BASE_URL;
const appId = import.meta.env.VITE_OPEN_WEATHER_APP_ID;

export function useFetch() {
  
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

  const getTodayForecast = async (cityName: string): Promise<TodayForecast | null> => {
    const cityLocationResponse = await getCityLatLon(cityName);
  
    if (cityLocationResponse && cityLocationResponse.length > 0) {
      const [cityLatLon] = cityLocationResponse;
      return await getCityForecast(cityLatLon.lat, cityLatLon.lon);
    }
  
    return null;
  }

  return {
    getCityForecast,
    get5daysCityForecast,
    getCityLatLon,
    getTodayForecast
  };
}