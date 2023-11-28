<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="d-flex">
    <RouterLink
      to="/"
      class="nav-item"
      activeClass="active">
      Home
    </RouterLink>
    <RouterLink 
      to="/favorites" 
      class="nav-item"
      activeClass="active">
      Favorites
    </RouterLink>
  </nav>
</template>

<style scoped>
  .nav-item {
    display: block;
    padding: .5rem 1rem;
    border: 1px solid grey;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    margin-right: 0.5rem;
    color: var(--blue);
  }
  .nav-item:hover {
    color: var(--nav-item-hover);
  }
  .active {
    color: var(--nav-item-active);
  }
</style>