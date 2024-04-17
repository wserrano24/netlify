<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  type?: 'modal' | 'body';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'body',
});

const cxBody = computed(() => [
  'theme-application-description',
  { 'theme-application-description-center': props.type === 'modal' },
]);
</script>

<template>
  <div :class="cxBody">
    <slot />
  </div>
</template>
