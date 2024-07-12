<template>
  <table class="list">
    <thead>
      <tr>
        <th>Pokemon</th>
        <th>Link</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="pokemons" v-for="pokemon of pokemons.results">
        <td>{{ pokemon.name }}</td>
        <td><RouterLink :to="pokemon.name">Detail</RouterLink> </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const pokemons = ref();
fetch('https://pokeapi.co/api/v2/pokemon').then(res => res.json()).then(res => pokemons.value = res);

</script>

<style scoped lang="scss">
.list {
  padding: 10px;
}
</style>
