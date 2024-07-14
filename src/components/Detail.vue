<template>
  <div v-if="pokemon" class="detail">
    <div class="detail__section">
      <div class="detail__text">
        <h2>#{{ pokemon.id }} {{ pokemon.name }}</h2>
        <h3>Types</h3>
        <div class="detail__types">
          <img
            v-for="slot of pokemon.types"
            :src="typeIcons[slot.type.name as keyof typeof typeIcons]"
            class="pokemon-type"
            :class="`pokemon-type__${slot.type.name}`" />
        </div>
        <h3>Moves</h3>
        <ul class="detail__moves">
          <li class="detail__move" v-for="{ move } of pokemon.moves">
            {{ move.name }}
          </li>
        </ul>
      </div>
      <div class="detail__image">
        <img
          v-if="pokemon.sprites?.front_default"
          :src="pokemon.sprites.front_default" />
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup lang="ts">
import { Pokemon } from '@/models/pokemon';
import { usePokemonRetriever } from '@/shared/use-pokemon-retriever';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import * as typeIcons from '@/assets/types';

const route = useRoute();
const { getByName } = usePokemonRetriever();

const pokemon = ref<Pokemon>();
getByName(route.params.name as string).then(
  (pokemonResponse) => (pokemon.value = pokemonResponse),
);
</script>

<style scoped lang="scss">
.detail {
  padding: 10px;
  width: 100%;

  &__section {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  &__text {
    flex-grow: 1;
  }

  &__image {
    min-width: 96px;
    img {
      width: 100%;
    }
  }

  &__types {
    display: flex;
    img {
      width: 20px;
    }
  }

  &__moves {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    padding: 0;
  }
  &__move {
    border: 1px solid #ccc;
    padding: 2px;
    font-size: 8px;
  }
}
</style>
