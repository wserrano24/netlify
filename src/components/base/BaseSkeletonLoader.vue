<script setup lang="ts">
import { TPlaceHolder } from '@/constants/bootstrap';

interface Props {
  animation?: 'glow' | 'wave';
  isLoading?: boolean;
  rows?: TPlaceHolder[];
}

const props = withDefaults(defineProps<Props>(), {
  animation: 'glow',
  isLoading: true,
  rows: () => [{ col: 12, size: '' }],
});

const cxWrapper = [
  'theme-skeleton-loader',
  { 'placeholder-glow': props.animation === 'glow' },
  { 'placeholder-wave': props.animation === 'wave' },
];
</script>

<template>
  <p v-if="props.isLoading" :class="cxWrapper">
    <span
      v-for="(row, index) in rows"
      :key="index"
      :class="`placeholder col-${row.col || 12} placeholder-${row.size}`"
    />
  </p>
  <slot v-else />
</template>
