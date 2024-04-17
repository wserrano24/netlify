<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  badgeType?:
    | 'default'
    | 'active'
    | 'open'
    | 'processing'
    | 'closed'
    | 'pending'
    | 'missing-docs'
    | 'pending-esign';
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  badgeType: 'default',
  label: 'Default Label',
});

const classObject = computed(() => [
  `theme-badge badge rounded-pill theme-primary`,
  `theme-badge-${props.badgeType}`,
]);
</script>

<template>
  <span :class="classObject">{{ label }}</span>
</template>

<style lang="scss" scoped>
@import '../../assets/sass/_theme';
@import '../../assets/sass/_variables';

@mixin badge-status-variations($variation-bg, $variation-indicator) {
  background-color: $variation-bg;

  &::before {
    width: $spacing-s;
    height: $spacing-s;

    // defines color of the status indicator
    background-color: $variation-indicator;
    border-radius: 50%;
    content: '';
    display: inline-block;
    margin-right: $spacing-xs;
  }
}

.theme-badge {
  background-color: $aa-day-blue;
  color: black;
  font-size: $font-size-xs;
  font-weight: $theme-font-weight-light;
  padding: 6px 12px;

  &-active,
  &-open {
    @include badge-status-variations($aa-green-lighter, $aa-green);
  }

  &-processing,
  &-review,
  &-pending-esign {
    @include badge-status-variations($aa-goldenrod-lighter, $aa-goldenrod);
  }

  &-closed {
    @include badge-status-variations($aa-marble, $aa-grey);
  }

  &-missing-docs,
  &-pending {
    @include badge-status-variations($aa-red-lighter, $aa-red);
  }
}
</style>
