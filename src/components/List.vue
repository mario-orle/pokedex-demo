<template>
  {{ $route.query.t }}

  <table class="list">
    <tbody>
      <tr
        @click="$router.replace({ path: pokemon.name })"
        v-for="pokemon of pokemons"
        v-show="
          (!$route.query.q ||
            pokemon.name?.includes($route.query.q as string)) &&
          (!$route.query.t?.length ||
            !pokemon.types ||
            pokemon.types.find((t) => $route.query.t?.includes(t.type.name)))
        ">
        <td class="list__id">{{ pokemon.id }}</td>
        <td class="list__sprite">
          <img
            v-if="pokemon.sprites?.front_default"
            :src="pokemon.sprites.front_default" />
        </td>
        <td class="list__name">{{ pokemon.name }}</td>
        <td class="list__types">
          <img
            v-for="slot of pokemon.types"
            :src="typeIcons[slot.type.name as keyof typeof typeIcons]"
            class="pokemon-type"
            :class="`pokemon-type__${slot.type.name}`" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { usePokemonRetriever } from '@/shared/use-pokemon-retriever';
import * as typeIcons from '@/assets/types';
const { pokemons } = usePokemonRetriever();
</script>

<style scoped lang="scss">
.list {
  padding: 10px;

  &__types {
    display: flex;
    img {
      width: 25px;
    }
  }
}
</style>
