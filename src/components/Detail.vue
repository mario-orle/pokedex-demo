<template>
  <div class="detail">
    {{ pokemon }}
  </div>
</template>

<script setup lang="ts">

import { usePokemonRetriever } from '@/shared/use-pokemon-retriever';
import { ref } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute()
const { getByName } = usePokemonRetriever();

const pokemon = ref();
getByName(route.params.name as string).then(pokemonResponse => pokemon.value = pokemonResponse);

</script>

<style scoped lang="scss">
.detail {
  padding: 10px;
}
</style>
