<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';
import { useField } from 'vee-validate';
import { useFormValidState } from '@/composables/useFormValidState';
import { ref, watch } from 'vue';
import BaseSkeletonLoader from './BaseSkeletonLoader.vue';
import BaseIcon from './BaseIcon.vue';

interface Props {
  dataTestId: string;
  hint?: string;
  id: string;
  isActive?: boolean;
  isLoading?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  label?: string;
  max?: string;
  min?: string;
  name: string;
  optionalText?: string;
  effectValue?: string; // Value set on parent (side effect)
}

const props = withDefaults(defineProps<Props>(), {
  hint: '',
  isDisabled: false,
  isRequired: false,
  label: '',
  max: '9999-12-31',
  min: '',
  optionalText: '',
  effectValue: undefined,
});

const { value, errorMessage, handleBlur, handleChange } = useField(props.name);
const { setFormCurrentValueState } = useFormValidState();
const input = ref<any>(null);

// Counter to keep counting the number of times keyup event get trigger
const keyupCounter = ref<number>(0);

/**
 * Issue: When user tries to enter date manually(not with date-picker/calender),
 * the date like 02/31/1990 is not being validated.
 * Defect: DE7306
 *
 * Root cause: input[type:date] does not fires input event when
 *             provided date is NOT-VALID AND user doesn't selects `dd` part (in mm/dd/yyyy) at last.
 * In that case vee-validate is not able to validate the date.
 *
 * Calling handleChange will force vee-validate.
 * Call handleChange when keyupCounter is greater or equal to 8
 *
 * date            : mm/dd/yyyy
 * keyup-counter   : 12 34 5678
 *
 */
const handleKeyup = (event: KeyboardEvent) => {
  keyupCounter.value++;
  keyupCounter.value >= 8 && handleChange(event);
};

const handleInputChange = (event: Event) => {
  handleChange(event);

  setFormCurrentValueState(props.name, value.value);
};

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

function formattedDates(input: string) {
  const pulledDate = /(\d{4})-(\d{2})-(\d{2})/g;

  const formattedString = input.replace(pulledDate, (match, year, month, day) => {
    return `${month}/${day}/${year}`;
  });

  return formattedString;
}
</script>
<template>
  <div class="theme-input-wrapper">
    <BaseSkeletonLoader :is-loading="props.isLoading" :rows="[{ col: 3 }]">
      <div v-if="props.optionalText" class="theme-input-label-wrapper">
        <label
          :for="id"
          class="form-label"
          :data-testid="`${props.dataTestId}-date-label`"
          >{{ props.label }}</label
        >
        <p
          v-if="props.optionalText"
          :id="props.id"
          class="form-text"
          :data-testid="`${props.dataTestId}-date-optional-text`"
        >
          {{ props.optionalText }}
        </p>
      </div>
      <label
        v-else
        :for="props.id"
        class="form-label"
        :data-testid="`${props.dataTestId}-date-label`"
        >{{ label }}</label
      >
    </BaseSkeletonLoader>
 
    <!-- Adding rule since label will exist after content has loaded -->
    <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
    <input
      :id="props.id"
      ref="input"
      type="date"
      :data-testid="`${props.dataTestId}-date-input`"
      :name="props.name"
      :class="[
        { 'not-valid': errorMessage, 'is-active': props.isActive },
        isReadOnly ? 'form-control-plaintext' : 'form-control',
      ]"
      :readonly="props.isReadOnly"
      :aria-describedby="props.id"
      :min="props.min"
      :max="props.max"
      :disabled="props.isDisabled"
      :required="props.isRequired"
      @blur="handleBlur"
      @input="handleInputChange"
      @keyup="handleKeyup"
    />
    <BaseIcon v-if="!errorMessage" :name="IconNames.Calendar" size="lg" class="calendar-icon"/>
    <BaseIcon v-if="errorMessage" :name="IconNames.Calendar" size="lg" class="calendar-icon-error"/>
    
    <p
      v-if="props.hint"
      :id="props.id"
      class="form-text"
      :data-testid="`${props.dataTestId}-date-hint`"
    >
      {{props.hint }}
    </p>
    <div v-if="errorMessage" class="theme-validation">
      <p
        class="help-message invalid-feedback"
        :data-testid="`${props.dataTestId}-date-error`"
      >
        <BaseIcon
          :color="Colors.AARed"
          :name="IconNames.AlertCircle"
          :size="IconSizes.Small"
        />
        {{ formattedDates(errorMessage) }}
      </p>
    </div>
  </div>
</template>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  width: 15px;
  height: 15px;
  opacity: 0;
}

.calendar-icon {
  position: absolute;
  right: 10px;
  bottom: 8px;
  pointer-events: none;
}

.calendar-icon-error {
  position: absolute;
  right: 10px;
  bottom: 48px;
  pointer-events: none;
}

</style>
