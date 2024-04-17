<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import BaseSkeletonLoader from './BaseSkeletonLoader.vue';
import { computed } from 'vue';
import BaseIcon from './BaseIcon.vue';

interface Props {
  dataTestId: string;
  isLoading: boolean;
  label?: string;
  textDirection?: 'column' | 'row';
  type?: 'default' | 'heading' | 'icon' | 'modal-opener';
  url?: string;
  value?: string | number;
  icon?: IconNames;
  target?: string;
  centered?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  label: '',
  value: '',
  textDirection: 'column',
  type: 'default',
  url: '',
  icon: undefined,
  target: undefined,
  centered: false,
});

const cxContainer = computed(() => [
  'theme-key-value-text',
  `theme-key-value-text-${props.type}`,
  `theme-key-value-text-${props.textDirection}`,
]);
</script>

<template>
  <div :class="cxContainer" :data-test-id="`${props.dataTestId}-key-value-text`">
    <BaseSkeletonLoader :is-loading="props.isLoading" :rows="[{ col: 8 }]">
      <div :class="props.centered ? 'centered ' + 'label-box' : 'label-box'">
        <span
          v-if="props.label"
          class="theme-key-value-text-label"
          :data-test-id="`${props.dataTestId}-key-value-text-label`"
        >
          {{ props.label }}
          <button
            v-if="props.type == 'modal-opener' && props.label && props.target"
            class="theme-key-value-text-modal-opener-button"
            data-bs-toggle="modal"
            :aria-controls="props.target"
            :aria-label="props.label"
            :data-bs-target="`#${props.target}`"
            :data-test-id="`${props.dataTestId}-key-value-text-modal-opener`"
          >
            <BaseIcon :name="props.icon" :size="IconSizes.Medium" />
          </button>
        </span>
        <slot name="label" />
      </div>
    </BaseSkeletonLoader>
    <BaseSkeletonLoader :is-loading="props.isLoading" :rows="[{ col: 8 }]">
      <span
        v-if="props.type != 'heading' && props.label && props.value"
        class="theme-key-value-text-value"
        :data-test-id="`${props.dataTestId}-key-value-text-value`"
        >{{ props.value }}</span
      >
      <a
        v-if="props.type == 'heading' && props.label && props.url"
        class="theme-key-value-text-more-link"
        :href="props.url"
        :data-test-id="`${props.dataTestId}-key-value-text-more-link`"
        >{{ props.value }}</a
      >
      <slot name="value" />
    </BaseSkeletonLoader>
  </div>
</template>

<style scoped>
.label-box {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.centered {
  justify-content: center;
}

.label-box > span {
  margin: 0px;
}
</style>
