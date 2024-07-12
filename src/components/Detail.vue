<template>
  <div class="detail">
    {{ pokemon }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute()

const pokemon = ref();
fetch(`https://pokeapi.co/api/v2/pokemon/${route.params.id}`).then(res => res.json()).then(res => pokemon.value = res);

</script>

<style scoped lang="scss">
.detail {
  padding: 10px;
}
</style>
