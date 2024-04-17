<!-- TODO: update minimal styling (this should be the default) -->
<!-- TODO: update focus/active state to show on keyboard input -->
<!-- TODO: apply proper disable attr to avoid keyboard input -->
<!-- TODO: delete minimal variation as it isn't a bootstrap button class -->
<script setup lang="ts">
import { IconNames } from '@/constants/icons';
import { computed } from 'vue';
import BaseIcon from './BaseIcon.vue';

interface Props {
  dataTestId: string;
  icon?: IconNames | null;
  isDisabled?: boolean;
  isLoading?: boolean;
  isReverse?: boolean;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  variation?: 'primary' | 'secondary' | 'outline-primary' | 'minimal' | 'link';
}

const props = withDefaults(defineProps<Props>(), {
  icon: null,
  isDisabled: false,
  isReverse: false,
  isLoading: false,
  label: 'Default Label',
  size: 'md',
  type: 'button',
  variation: 'primary',
});

const emit = defineEmits(['click']);

const cxBtn = computed(() => [
  'theme-btn',
  'btn',
  `btn-${props.size}`,
  `btn-${props.variation}`,
  {
    ['disabled']: props.isDisabled,
    ['loading']: props.isLoading,
  },
]);

function handleClick() {
  emit('click');
}
</script>

<template>
  <button
    :aria-disabled="props.isDisabled"
    :disabled="props.isDisabled"
    :class="cxBtn"
    :data-testid="`${props.dataTestId}-button`"
    :type="props.type"
    @click="handleClick"
  >
    <span
      v-if="props.isLoading"
      class="spinner-border spinner-border-md"
      role="status"
      aria-hidden="true"
      aria-label="loading"
      aria-live="assertive"
    > </span>
    <BaseIcon v-if="props.icon && !isReverse"/>
    {{ props.label }}
    <BaseIcon v-if="props.icon && isReverse"/>
  </button>
</template>
