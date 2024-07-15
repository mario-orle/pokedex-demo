<template>
  <div class="pokedex">
    <div class="pokedex__header"></div>
    <div class="pokedex__main">
      <div class="pokedex__screen">
        <slot />
      </div>
    </div>
    <div class="pokedex__controls"><Controls /></div>
  </div>
</template>

<script lang="ts" setup>
import Controls from '@/components/Controls.vue';
</script>

<style scoped lang="scss">
.pokedex {
  width: 100%;
  height: 100%;
  background-color: #c00d0d;
  display: flex;
  flex-direction: column;
  border-radius: 15px;

  &__header {
    height: 20%;
    min-height: 100px;
  }

  &__main {
    flex-grow: 1;
    width: calc(100% - 20px);
    max-height: calc(40% - 20px);
    margin: 10px;
    background-color: #b0b0b0;
    border-radius: 15px;
    position: relative;
    &::after {
      content: '';
      border-top: 30px solid #b0b0b0;
      border-left: 30px solid #c00d0d;
      height: 0;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }

  &__screen {
    width: calc(100% - 40px);
    height: calc(100% - 60px);
    margin: 20px;
    margin-bottom: 40px;
    background-color: #fff;
    border-radius: 15px;
    border: 3px solid #000;
    overflow: auto;
  }

  &__controls {
    height: 40%;
    min-height: 200px;
  }
}
</style>
