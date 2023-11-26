<script setup lang="ts">
import ConfirmModal from '@/components/Modals/ConfirmModal.vue';
import {useModal} from '@/components/Modals/useModal';
import type { ForecastListItem } from '@/components/WeatherForecast/WeatherForecast.vue';

const props = defineProps<{
  isLast: boolean,
  forecast: ForecastListItem
}>();

const emit = defineEmits<{
  (e: 'changeForecastCity', name: string, id: number): void,
  (e: 'addForecast'): void,
  (e: 'deleteForecast', id: number): void
}>();

const {forecast} = props;
const {show, showModal, hideModal} = useModal();

const onChangeCity = (e: Event) => {
  emit('changeForecastCity', (e.target as HTMLInputElement).value, forecast.id);
}

</script>

<template>
  <li class="card">
    <div class="card-header">
      <div class="card-input-container">
        <input
          :value="forecast.cityName"
          @change="onChangeCity"
          class="card-input"
          placeholder="Type city name"
        />
        <div v-show="forecast.error">{{ forecast.error }}</div>
      </div>
      <button
        :disabled="!forecast.cityWeather"
        class="btn btn-primary">
        Add to Favorites
      </button>
    </div>
    <div class="card-content">
      <template v-if="!forecast.fetching && forecast.cityWeather">
        <div class="card-left-side">
          <h2>Weather Today in {{ forecast.cityWeather.name }}</h2>
          <div>
            <span>Feels like:</span>
            <div class="feels-like-deg">{{ forecast.cityWeather.main.feels_like }}&deg;</div>
          </div>
          <div class="card-content-data">
            <div class="card-content-data-left">
              <div class="card-content-data-item">
                Temp
                <span>{{ forecast.cityWeather.main.temp }}&deg;</span>
              </div>
              <div class="card-content-data-item">
                Temp min
                <span>{{ forecast.cityWeather.main.temp_min }}&deg;</span>
              </div>
              <div class="card-content-data-item">
                Temp max
                <span>
                  {{ forecast.cityWeather.main.temp_max }}&deg;
                </span>
              </div>
            </div>
            <div class="card-content-data-right">
              <div class="card-content-data-item">
                Pressure
                <span>{{ forecast.cityWeather.main.pressure }}</span>
              </div>
              <div class="card-content-data-item">
                Humidity
                <span>{{ forecast.cityWeather.main.humidity }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card-right-side">
          <button
            class="btn btn-secondary action-button"
            @click="() => emit('addForecast')">
            +
          </button>
          <button
            class="btn btn-secondary action-button"
            :disabled="isLast"
            @click="() => !isLast && showModal()">
            -
          </button>
        </div>
      </template>
    </div>
  </li>

  <ConfirmModal
    v-if="show"
    title="Delete forecast weather card"
    text="Are you sure you want to delete this forecast weather card?"
    confirmBtnText="Delete"
    @onClose="() => hideModal()"
    @onConfirm="() => emit('deleteForecast', forecast.id)"
  />
</template>

<style scoped>
.card {
  padding: 1rem 2rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  box-shadow: 0 0 12px 0 rgba(0,0,0,.2);
  background-color: var(--color-background-card);
}
.card-header {
  display: flex;
  justify-content: space-between;
  flex: 1;
}
.card-content {
  display: flex;
}
.card-input-container {
  flex: 1;
}
.card-input {
  width: 50%;
  height: 24px;
}
.card-left-side {
  flex: 1;
}
.card-right-side {
  display: flex;
  flex: 0 0 100px;
  flex-direction: column;
  justify-content: center;
}
.action-button {
  margin-bottom: 0.5rem;
}
.feels-like-deg {
  font-size: 2rem;
  font-weight: 600;
}
.card-content-data {
  display: flex;
  flex: 1;
}
.card-content-data-left, .card-content-data-right {
  flex: 1;
  margin-right: 3rem;
}
.card-content-data-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  border-bottom: 1px solid grey;
}
.input-error-message {
  color: var(--input-error-message);
  margin: 0.5rem 0;
}
</style>