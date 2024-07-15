<template>
  <div class="controls">
    <div class="controls__filters">
      <div class="controls__filter-text">
        <label for="query"><h3>Filter:</h3></label>
        <input @input="onInput" v-model="query" id="query" />
      </div>
      <h3>Types:</h3>
      <div class="controls__filter-types">
        <label v-for="(_, key) of typeIcons" class="controls__filter-type">
          <PokeType
            :type="key"
            :class="{ unselected: !types.includes(key) }"
            class="pokemon-type" />
          <input
            @change="onInput"
            type="checkbox"
            v-model="types"
            :value="key" />
        </label>
      </div>
    </div>
    <div class="controls__dpad">
      <div class="controls__dpad-container">
        <div v-for="idx in 3" :key="`row${idx}`" class="controls__dpad-row">
          <div v-for="idx in 3" :key="`col${idx}`" class="controls__dpad-col">
            &nbsp;
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as typeIcons from '@/assets/types';
import PokeType from './PokeType.vue';

const router = useRouter();
const query = ref<string>();
const types = ref(Object.keys(typeIcons));

function onInput() {
  router.replace({ query: { q: query.value, t: types.value.join(',') } });
}

onMounted(() => {
  if (useRoute().query.q) {
    query.value = useRoute().query.q as string;
  }
  if (useRoute().query.t) {
    types.value = (useRoute().query.t as string).split(',');
  }
});
</script>

<style scoped lang="scss">
.controls {
  padding: 0 10px;
  display: flex;
  $component-class: &;

  &__filters {
    width: 50%;
    display: flex;
    flex-flow: column;
    gap: 10px;
  }

  &__filter-types {
    display: flex;
    flex-wrap: wrap;
  }

  &__filter-type {
    width: 30px;
    display: block;
    input {
      display: none;
    }
    img.unselected {
      filter: grayscale(1);
      opacity: 0.5;
    }
  }

  &__dpad {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__dpad-container {
    padding-top: 30px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  &__dpad-row {
    &:first-of-type,
    &:last-of-type {
      #{$component-class}__dpad-col:first-of-type,
      #{$component-class}__dpad-col:last-of-type {
        background: none;
      }
    }
  }
  &__dpad-col {
    width: 40px;
    height: 40px;
    background-color: #333;
  }
}
</style>
