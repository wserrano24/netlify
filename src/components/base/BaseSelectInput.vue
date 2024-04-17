<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';
import { useField } from 'vee-validate';
import { ref, watch } from 'vue';
import { useFormValidState } from '@/composables/useFormValidState';
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
  isActive?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  isMultiple?: boolean;
  items: SelectItem[];
  label?: string;
  name: string;
  optionalText?: string;
  effectValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  hint: '',
  isDisabled: false,
  isMultiple: false,
  label: '',
  optionalText: '',
  effectValue: '',
});

const input = ref<any>(null);
const toggledSelect = ref<any>(false);
  
const { value, errorMessage, handleBlur, handleChange } = useField(props.name);

const { setFormCurrentValueState } = useFormValidState();

const handleChangeValue = (e: Event) => {
  const newValue = (e.target as HTMLInputElement).value;
  emit('change', newValue);
  handleChange(e);

  setFormCurrentValueState(props.name, newValue);
};

const handleToggleSelectValue = (): void => {
  toggledSelect.value = !toggledSelect.value;
}

const handleLostFocus = (): void => {
 toggledSelect.value = false;
}
 
watch(
  () => {
    props.effectValue;
  },
  () => {
    // Updates field value in useField and DOM
    value.value = props.effectValue;
    input.value.value = props.effectValue;
  },
  { deep: true }
);
</script>
<template>
  <!-- TODO: styling for input group and input border -->
  <div class="theme-input-wrapper">
    <BaseSkeletonLoader :is-loading="props.isLoading" :rows="[{ col: 3 }]">
      <div v-if="props.optionalText" class="theme-input-label-wrapper">
        <label
          :for="props.id"
          class="form-label"
          :data-testid="`${props.dataTestId}-select-input-label`"
        >
          {{ label }}
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
      :class="[
        { 'not-valid': errorMessage, 'is-active': props.isActive },
        'form-select',
        toggledSelect ? 'has-been-selected' : 'has-not-been-selected',
      ]"
      :name="props.name"
      :aria-label="props.label"
      :aria-describedby="props.id"
      :data-testid="`${props.dataTestId}-select-input`"
      :multiple="props.isMultiple"
      :disabled="props.isDisabled"
      required
      @click="handleToggleSelectValue"
      @input="handleChangeValue"
      @blur="handleBlur(); handleLostFocus();"
    >
      <option v-for="item in props.items" :key="item.value" :value="item.value">
        {{ item.label }}
      </option>
    </select>
    <p
      v-if="hint"
      :id="id"
      class="form-text"
      :data-testid="`${props.dataTestId}-select-input-hint`"
    >
      {{ hint }}
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
