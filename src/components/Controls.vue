<template>
  <div class="controls">
    <div class="controls__filters">
      <div class="controls__filter">
        <label for="query">Filter</label>
        <input @input="onInput" v-model="query" id="query" />
      </div>
    </div>
    <div class="controls__dpad"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const query = ref(useRoute().query.q);

function onInput() {
  router.replace({ query: { q: query.value } });
}
</script>

<style scoped lang="scss">
.controls {
  padding: 10px;
  display: flex;
  &__filters {
    width: 50%;
  }
  &__dpad {
    width: 50%;
  }
}
</style>
