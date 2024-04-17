<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';
import { useField } from 'vee-validate';
import { ref, watch } from 'vue';
import BaseSkeletonLoader from './BaseSkeletonLoader.vue';
import BaseIcon from './BaseIcon.vue';

const emit = defineEmits(['change']);

interface SelectItem {
  label: string;
  value: string | number;
}

interface Props {
  dataTestId: string;
  hint?: string;
  id: string;
  size: number;
  isActive?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  items: SelectItem[];
  label?: string;
  name: string;
  optionalText?: string;
  effectValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  hint: '',
  size: 0,
  isDisabled: false,
  label: '',
  optionalText: '',
  effectValue: '',
});

const input = ref<any>(null);
const { value, errorMessage, handleBlur, handleChange } = useField(props.name);

const handleChangeValue = (e: Event) => {
  emit('change', (e.target as HTMLInputElement).value);
  handleChange(e);
};

watch(
  () => {
    props.effectValue;
  },
  () => {
    value.value = props.effectValue;
    input.value.value = props.effectValue;
  },
  { deep: true }
);
</script>
<template>
  <div class="theme-input-wrapper">
    <BaseSkeletonLoader :is-loading="props.isLoading" :rows="[{ col: 3 }]">
      <div v-if="props.optionalText" class="theme-input-label-wrapper">
        <label
          :for="props.id"
          class="form-label"
          :data-testid="`${props.dataTestId}-select-input-label`"
        >
          {{ props.label }}
        </label>
        <p
          v-if="props.optionalText"
          :id="props.id"
          class="form-text"
          :data-testid="`${props.dataTestId}-select-input-optional-text`"
        >
          {{ props.optionalText }}
        </p>
      </div>
      <label
        v-else
        :for="props.id"
        class="form-label"
        :data-testid="`${props.dataTestId}-select-input-label`"
      >
        {{ label }}
      </label>
    </BaseSkeletonLoader>
    <select
      :id="props.id"
      ref="input"
      :size="props.items.length"
      :class="[
        { 'not-valid': errorMessage, 'is-active': props.isActive },
        'form-select',
      ]"
      :name="props.name"
      :aria-label="props.label"
      :aria-describedby="props.id"
      :data-testid="`${props.dataTestId}-select-input`"
      :disabled="props.isDisabled"
      required
      @input="handleChangeValue"
      @blur="handleBlur"
    >
      <option
        v-for="(item, index) in props.items"
        :id="`ID-${index}`"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </option>
    </select>
    <p
      v-if="props.hint"
      :id="props.id"
      class="form-text"
      :data-testid="`${props.dataTestId}-select-input-hint`"
    >
      {{ props.hint }}
    </p>
    <div v-if="errorMessage" class="theme-validation">
      <p
        class="help-message invalid-feedback"
        :data-testid="`${props.dataTestId}-select-input-error`"
      >
        <BaseIcon
          :color="Colors.AARed"
          :name="IconNames.AlertCircle"
          :size="IconSizes.Small"
        />
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>
<style scoped>
#ID-0 {
  font-weight: 600;
}
</style>
