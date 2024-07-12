<template>
  <div class="wrapper">
    <Pokedex>
      <router-view />
    </Pokedex>
  </div>
</template>

<script setup lang="ts">
import Pokedex from './components/Pokedex.vue'
</script>

<style scoped lang="scss">
.wrapper {
  padding: 10px;
  height: 100%;
}
</style>
