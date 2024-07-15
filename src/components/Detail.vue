<template>
  <div class="detail">
    <router-link to="/">< List</router-link>
    <div v-if="pokemon" class="detail__section">
      <div class="detail__text">
        <h2>#{{ pokemon.id }} {{ pokemon.name }}</h2>
        <h3>Types</h3>
        <div class="detail__types">
          <PokeType v-for="type of pokemon.types" :type="type" />
        </div>
      </div>
      <div class="detail__image">
        <img v-if="pokemon.image" :src="pokemon.image" />
      </div>
      <div class="detail_last_section">
        <h3>Moves</h3>
        <ul class="detail__moves">
          <li class="detail__move" v-for="move of pokemon.moves">
            {{ move }}
          </li>
        </ul>
      </div>
    </div>
    <div v-else>Loading...</div>
  </div>
</template>

<script setup lang="ts">
import { PokemonView } from '@/models/pokemon';
import { usePokemonRetriever } from '@/shared/use-pokemon-retriever';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import PokeType from '@/components/PokeType.vue';

const route = useRoute();
const { getByName } = usePokemonRetriever();

const pokemon = ref<PokemonView>();
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
    flex-wrap: wrap;
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
    gap: 5px;
  }
  &__move {
    border: 1px solid #ccc;
    padding: 5px;
    background: #bbb;
    border-radius: 5px;
    font-size: 13px;
  }
}
</style>
