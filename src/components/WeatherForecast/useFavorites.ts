import { ref, onMounted, toValue } from 'vue'
import type { ForecastListItem } from './WeatherForecast.vue';

export interface Favorite {
  id: number;
  name: string;
  coords: {
    lat: number;
    lon: number;
  }
}

export function useFavorites() {
  const favorites = ref<Array<Favorite>>([]);

  const fetchFavorites = (): Array<Favorite> => {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  }

  const updateFavorites = () => {
    localStorage.setItem('favorites', JSON.stringify(favorites.value));
  }

  onMounted(() => {
    favorites.value = fetchFavorites();
  });

  const addToFavorites = (forecast: ForecastListItem) => {
    if (forecast.today) {
      if (!favorites.value.find(favorite => favorite.id === forecast.id)) {
        favorites.value.push({
          id: forecast.id,
          name: forecast.cityName,
          coords: forecast.today.coord
        });

        console.log('favorites.value', favorites.value);
        

        updateFavorites();
      }
    }
  }

  const deleteFavorite = (id: number) => {
    favorites.value = favorites.value.filter(favorite => favorite.id !== id);
    updateFavorites();
  }

  return {
    favorites,
    addToFavorites,
    deleteFavorite
  };
}