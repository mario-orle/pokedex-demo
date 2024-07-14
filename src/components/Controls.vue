<template>
  <div class="controls">
    <div class="controls__filters">
      <div class="controls__filter-text">
        <label for="query">Filter</label>
        <input @input="onInput" v-model="query" id="query" />
      </div>
      <div class="controls__filter-types">
        <label
          v-for="(typeIcon, key) of typeIcons"
          class="controls__filter-type">
          <img
            :src="typeIcon"
            :class="[
              `pokemon-type__${key}`,
              { unselected: !types.includes(key) },
            ]"
            class="pokemon-type" />
          <input
            @change="onInput"
            type="checkbox"
            v-model="types"
            :value="key" />
        </label>
      </div>
    </div>
    <div class="controls__dpad"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as typeIcons from '@/assets/types';

const router = useRouter();
const query = ref(useRoute().query.q);
const types = ref(Object.keys(typeIcons));

if (Array.isArray(useRoute().query.t)) {
  types.value = useRoute().query.t as string[];
}
if (useRoute().query.t) {
  types.value = [useRoute().query.t as string];
}
function onInput() {
  router.replace({ query: { q: query.value, t: types.value } });
}
</script>

<style scoped lang="scss">
.controls {
  padding: 10px;
  display: flex;
  &__filters {
    width: 50%;
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
  }
}
</style>
