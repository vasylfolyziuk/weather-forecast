<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/Header/Header.vue';
</script>

<template>
  <Header />
  <div class="wrapper">
    <nav>
      <RouterLink to="/" activeClass="active">Home</RouterLink>
      <RouterLink to="/favorites" activeClass="active">About</RouterLink>
    </nav>
  </div>

  <RouterView />
</template>

<style scoped>
  .active {
    color: red;
  }
</style>

