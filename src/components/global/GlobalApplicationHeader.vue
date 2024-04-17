<script setup lang="ts">
import { useSlots } from 'vue';

const slots = useSlots();
</script>
<template>
  <header class="theme-global-application-header row align-items-center">
    <div v-if="slots.left" class="d-flex justify-content-start col">
      <slot name="left" />
    </div>
    <div v-if="slots.center" class="col d-flex justify-content-center">
      <slot name="center" />
    </div>
    <div v-if="slots.right" class="col d-flex justify-content-end">
      <slot name="right" />
    </div>
  </header>
</template>
