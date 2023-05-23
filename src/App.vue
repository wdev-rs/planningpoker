<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">

        <div class="w3-bar w3-black">
            <RouterLink to="/" class="w3-bar-item w3-button">Home</RouterLink>
            <RouterLink to="/about" class="w3-bar-item w3-button">About</RouterLink>
        </div>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>

</style>
