<script setup lang="ts">
import { computed, type ComputedRef } from 'vue';
import type { RangeMode } from '@/types/RangeMode';
import ConfirmModal from '@/components/Modals/ConfirmModal.vue';
import {useModal} from '@/components/Modals/useModal';
import type { ForecastListItem } from '@/components/WeatherForecast/WeatherForecast.vue';
import WeatherForecastCardData from './WeatherForecastCardData.vue';
import type { WeekForecast } from '@/types/WeekForecast';
import Spinner from '../Spinner/Spinner.vue';

type DAY = {
  date: string;
  list: WeekForecast['list']
};

const props = defineProps<{
  isSingle: boolean,
  isLast: boolean,
  forecast: ForecastListItem
}>();

const emit = defineEmits<{
  (e: 'changeForecastCity', name: string, id: number): void,
  (e: 'addForecast'): void,
  (e: 'deleteForecast', id: number): void,
  (e: 'switchRange', rangeMode: RangeMode, id: number): void
}>();

const {forecast} = props;
const {show, showModal, hideModal} = useModal();

const dates: ComputedRef<DAY[]> = computed(() => {
  const list: string[] = [];
  const days: DAY[] = [];

  if (forecast.rangeMode === 'WEEK') {
    forecast.week?.list.forEach(day => {
      const date = day.dt_txt.split(' ')[0];
      if (!list.includes(date)) {
        list.push(date);
      }
    });

    list.forEach((date: string) => {
      days.push({
        date: date,
        list: forecast.week?.list
          .filter(listItem => listItem.dt_txt.includes(date)) as WeekForecast['list']
      })
    });
  }
  
  return days;
});

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
        :disabled="!forecast.today"
        class="btn btn-primary">
        Add to Favorites
      </button>

      <button
        class="btn btn-secondary action-button"
        :disabled="!isLast"
        @click="() => emit('addForecast')">
        +
      </button>
      <button
        class="btn btn-secondary action-button"
        :disabled="isSingle"
        @click="() => !isSingle && showModal()">
        -
      </button>
    </div>
    <div>
      <template v-if="forecast.today">
        <div>
          <h2>Weather in {{ forecast.today.name }}</h2>

          <button
            class="btn btn-primary action-button"
            :class="{ active: forecast.rangeMode === 'DAY' }"
            @click="() => emit('switchRange', 'DAY', forecast.id)">
            Day
          </button>
          <button
            class="btn btn-primary action-button"
            :class="{ active: forecast.rangeMode === 'WEEK' }"
            @click="() => emit('switchRange', 'WEEK', forecast.id)">
            Week
          </button>

          <Spinner v-if="forecast.fetching" />
          
          <template v-else>
            <WeatherForecastCardData
              v-if="forecast.rangeMode === 'DAY'"
              :temp="forecast.today.main.temp"
              :visibility="forecast.today.visibility"
              :windSpeed="forecast.today.wind.speed"
              :pressure="forecast.today.main.pressure"
              :humidity="forecast.today.main.humidity"
            />

            <template v-else>
              <div class="card-hours-list">
                <template
                  v-for="item in dates"
                  :key="item.date">
                  <div class="card-hours-item">
                    <WeatherForecastCardData
                      v-for="(day, index) in item.list"
                      :key="day.dt_txt"
                      :showDate="index === 0"
                      :date="item.date"
                      :hour="day.dt_txt.split(' ')[1]"
                      :temp="day.main.temp"
                      :visibility="day.visibility"
                      :windSpeed="day.wind.speed"
                      :pressure="day.main.pressure"
                      :humidity="day.main.humidity"
                    />
                  </div>
                </template>
              </div>
            </template>
          </template>
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

<style>
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
.card-input-container {
  flex: 1;
}
.card-input {
  width: 50%;
  height: 24px;
}
.action-button {
  margin-bottom: 0.5rem;
}
.card-hours-list {
  display: flex;
  flex-wrap: wrap;
}
.card-hours-item {
  flex: 1;
  margin: 0 0.5rem;
  box-shadow: 0 0 12px 0 rgba(0,0,0,.2);
  border-radius: 10px;
  padding: 5px 10px;
}
.card-content-data {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
}
.card-content-data-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  flex: 1;
  border: 1px solid grey;
}
.input-error-message {
  color: var(--input-error-message);
  margin: 0.5rem 0;
}
</style>