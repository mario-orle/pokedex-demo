<template>
  <table class="list">
    <tbody>
      <tr
        v-for="pokemon of pokemons"
        v-show="
          !$route.query.q || pokemon.name?.includes($route.query.q as string)
        ">
        <td>{{ pokemon.id }}</td>
        <td>
          <img
            v-if="pokemon.sprites?.front_default"
            :src="pokemon.sprites.front_default" />
        </td>
        <td>{{ pokemon.name }}</td>
        <td><RouterLink :to="pokemon.name">Detail</RouterLink></td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { usePokemonRetriever } from '@/shared/use-pokemon-retriever';
const { pokemons } = usePokemonRetriever();
</script>

<style scoped lang="scss">
.list {
  padding: 10px;
}
</style>
