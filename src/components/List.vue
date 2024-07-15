<template>
  <table class="list">
    <tbody>
      <tr
        @click="$router.replace({ path: pokemon.name })"
        v-for="pokemon of pokemonList"
        v-show="
          (!$route.query.q ||
            pokemon.name
              ?.toLowerCase()
              .includes(($route.query.q as string).toLowerCase())) &&
          (!$route.query.t?.length ||
            !pokemon.types ||
            pokemon.types.find((t) => $route.query.t?.includes(t)))
        "
        class="list__row">
        <td class="list__id">{{ pokemon.id }}</td>
        <td class="list__sprite">
          <img v-if="pokemon.image" :src="pokemon.image" />
        </td>
        <td class="list__name">{{ pokemon.name }}</td>
        <td class="list__types">
          <img
            v-for="type of pokemon.types"
            :src="typeIcons[type as keyof typeof typeIcons]"
            class="pokemon-type"
            :class="`pokemon-type__${type}`" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { usePokemonRetriever } from '@/shared/use-pokemon-retriever';
import * as typeIcons from '@/assets/types';
const { pokemonList } = usePokemonRetriever();
</script>

<style scoped lang="scss">
.list {
  padding: 10px;

  &__row {
    height: 40px;
  }

  &__id {
    max-width: 20px;
  }
  &__image {
    width: 40px;
  }
  &__types {
    width: 60px;
    display: flex;
    img {
      width: 25px;
    }
  }
}
</style>
