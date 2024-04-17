<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';
import BaseIcon from './BaseIcon.vue';

interface Props {
  dataTestId: string;
  id: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  label?: string;
  name: string;
  type?: 'email' | 'number' | 'password' | 'search' | 'tel' | 'text';
  placeholderValue?: string;
}

withDefaults(defineProps<Props>(), {
  label: '',
  placeholderValue: '',
  type: 'text',
});
</script>
<template>
  <div class="theme-input-wrapper">
    <label
      :data-testid="`${dataTestId}-${type}-input-label`"
      :for="id"
      class="form-label"
    >
      {{ label }}
    </label>
    <slot name="icon"></slot>
    <div class="theme-input-icon-wrapper">
      <div class="theme-input-icon">
        <BaseIcon
          v-if="type === 'search' || placeholderValue"
          :color="Colors.Black"
          :name="IconNames[type === 'search' ? 'Search' : 'Check']"
          :size="IconSizes.Medium"
        />
      </div>
      <!-- Adding rule since label will exist after content has loaded -->
      <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
      <input
        :id="id"
        :class="['is-password', 'form-control']"
        :aria-describedby="id"
        :data-testid="`${dataTestId}-${type}-input`"
        :disabled="isDisabled"
        :name="name"
        :readonly="isReadOnly"
        :type="type"
        :value="placeholderValue"
        required
      />
    </div>
  </div>
</template>
