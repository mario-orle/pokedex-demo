<template>
  <img
    :src="typeIcons[type as keyof typeof typeIcons]"
    class="pokemon-type"
    :class="`pokemon-type__${type}`" />
</template>
<script lang="ts" setup>
import * as typeIcons from '@/assets/types';

defineProps<{ type: string }>();
</script>

<style lang="scss" scoped>
.pokemon-type {
  padding: 5px;
  border: 1px solid #333;
  border-radius: 5px;

  &__bug {
    background-color: #91a119;
  }
  &__dark {
    background-color: #614c4e;
  }
  &__dragon {
    background-color: #4f60e1;
  }
  &__electric {
    background-color: #fabf00;
  }
  &__fairy {
    background-color: #ef70ef;
  }
  &__fighting {
    background-color: #fe7f00;
  }
  &__fire {
    background-color: #e52829;
  }
  &__flying {
    background-color: #81b8ef;
  }
  &__ghost {
    background-color: #6f416f;
  }
  &__grass {
    background-color: #3da129;
  }
  &__ground {
    background-color: #905120;
  }
  &__ice {
    background-color: #3ccef3;
  }
  &__normal {
    background-color: #a0a19f;
  }
  &__poison {
    background-color: #9141cb;
  }
  &__psychic {
    background-color: #ee4178;
  }
  &__rock {
    background-color: #afa982;
  }
  &__shadow {
    background-color: #943994;
  }
  &__steel {
    background-color: #5fa1b8;
  }
  &__stellar {
    background-color: #40b5a5;
  }
  &__unknown {
    background-color: #68a090;
  }
  &__water {
    background-color: #2880ee;
  }
}
</style>
