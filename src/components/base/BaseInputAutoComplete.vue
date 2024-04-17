<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';
import { getFullAddressObject } from '@/utils/map';
import { useField } from 'vee-validate';
import { onMounted, ref, watch } from 'vue';
import { useFormValidState } from '@/composables/useFormValidState';
import BaseIcon from './BaseIcon.vue';

interface Props {
  dataTestId: string;
  hint?: string;
  id: string;
  isDisabled?: boolean;
  label?: string;
  name: string;
  optionalText?: string;
  options?:any;
  placeholder?: string;
  effectValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  hint: '',
  isDisabled: false,
  label: '',
  optionalText: '',
  options: {
    componentRestrictions: { country: 'us' },
    strictBounds: true,
    types: ['address'],
  },
  placeholder: '',
  effectValue: undefined,
});

const emit = defineEmits(['handlePlace']);
const input = ref();

const { value, errorMessage, handleBlur, handleChange } = useField(props.name);
const { setFormCurrentValueState } = useFormValidState();

const handlePlace = (data = {}) => {
  emit('handlePlace', data);

  const addressObject = getFullAddressObject(data);
  const {
    StreetNumber = '',
    StreetName = '',
    City = '',
    StateCode = '',
    PostalCode = '',
  } = addressObject || {};

  const newValue = `${StreetNumber}, ${StreetName}, ${City}, ${StateCode}, ${PostalCode}`;

  setFormCurrentValueState(props.name, newValue);
};

const handleKey = (e) => {
  if (![9, 13, 27].includes(e.keyCode)) {
    emit('handlePlace', {});
  }
};

onMounted(() => {
  value.value = props.effectValue;
  input.value.$el.value = props.effectValue;
});

watch(
  () => {
    props.effectValue;
  },() => {
    // Updates field value in useField and DOM
    value.value = props.effectValue;
    input.value.$el.value = props.effectValue;
  },
  { deep: true }
);
</script>
<template>
  <div class="theme-input-wrapper">
    <div v-if="props.optionalText" class="theme-input-label-wrapper">
      <label
        :for="props.id"
        class="form-label"
        :data-testid="`${props.dataTestId}-autocomplete-input-label`"
      >
        {{ label }}
      </label>
      <p
        v-if="props.optionalText"
        class="form-text"
        :data-testid="`${props.dataTestId}-autocomplete-input-optional-text`"
      >
        {{ props.optionalText }}
      </p>
    </div>
    <label
      v-else-if="props.label"
      :for="props.id"
      class="form-label"
      :data-testid="`${props.dataTestId}-autocomplete-input-label`"
    >
      {{ label }}
    </label>
    <div class="theme-input-icon-wrapper">
      <div class="theme-input-icon">
        <BaseIcon :name="IconNames.Search" :size="IconSizes.Medium" />
      </div>
      <GMapAutocomplete
        :id="props.id"
        ref="input"
        :class="[{ 'not-valid': errorMessage }]"
        :data-testid="`${props.dataTestId}-autocomplete-input`"
        :name="props.name"
        :options="props.options"
        :placeholder="props.placeholder"
        :disabled="props.isDisabled"
        class="is-password form-control"
        @keydown="handleKey"
        @blur="handleBlur"
        @input="handleChange"
        @place_changed="handlePlace"
      />
    </div>
    <p
      v-if="props.hint"
      class="form-text"
      :data-testid="`${props.dataTestId}-autocomplete-input-hint`"
    >
      {{ props.hint }}
    </p>
    <div v-if="errorMessage" class="theme-validation">
      <p class="help-message invalid-feedback">
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
