<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/Header/Header.vue';
import NavBar from '@/components/NavBar/NavBar.vue';
</script>

<template>
  <Header />
  <div class="wrapper">
    <NavBar />
  </div>

  <RouterView />
</template>

