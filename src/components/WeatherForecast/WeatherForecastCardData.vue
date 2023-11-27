<script setup lang="ts">

export interface ForecastCardData {
  date?: string;
  hour?: string;
  showDate: boolean;
  temp: number;
  visibility: number;
  windSpeed: number;
  pressure: number;
  humidity: number;
}

const now = new Date();

// defineProps<ForecastCardData>();

withDefaults(defineProps<ForecastCardData>(), {
  date: `${new Date().getFullYear()}-${(new Date().getMonth() + 1)}-${new Date().getDate()}`,
  showDate: true
})
</script>

<template>
  <h2 v-if="showDate">{{ date }}</h2>
  <p v-if="hour" class="hour">{{ hour }}</p>
  <div class="card-content-data">
    <div class="card-content-data-item">
      Temp
      <span>{{ temp }}&deg;</span>
    </div>
    <div class="card-content-data-item">
      Visibility
      <span>{{ visibility }}</span>
    </div>
    <div class="card-content-data-item">
      Wind speed
      <span>
        {{ windSpeed }}
      </span>
    </div>
    <div class="card-content-data-item">
      Pressure
      <span>{{ pressure }}</span>
    </div>
    <div class="card-content-data-item">
      Humidity
      <span>{{ humidity }}</span>
    </div>
  </div>
</template>

<style scoped>
.hour {
  text-align: center;
  margin: 5px 0;
  color: blue;
}
</style>