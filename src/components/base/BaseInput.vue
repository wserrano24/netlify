<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';
import { useField } from 'vee-validate';
import { useMask } from '@/composables/useMask';
import { onMounted, reactive, ref, watch } from 'vue';
import { useInputValidState } from '@/composables/useInputValidState';
import { useFormValidState } from '@/composables/useFormValidState';
import useContentfulImage from '@/composables/useContentfulImage';
import BaseSkeletonLoader from './BaseSkeletonLoader.vue';
import BaseIcon from './BaseIcon.vue';

interface Props {
  autoComplete?: string;
  dataTestId: string;
  getError?: boolean;
  hint?: string;
  id: string;
  isActive?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  isReadOnly?: boolean;
  label?: string;
  mask?: string | string[];
  maxLength?: string;
  name: string;
  optionalText?: string;
  flagIcon?: boolean;
  type?: 'email' | 'number' | 'password' | 'search' | 'tel' | 'text';
  effectValue?: any;
}

const props = withDefaults(defineProps<Props>(), {
  effectValue: undefined,
  getError: false,
  hint: '',
  label: '',
  mask: '',
  maxLength: '500', // High number to consider most of the cases
  optionalText: '',
  type: 'text',
  showWarningText: false,
  autoComplete: 'off',
  flagIcon: false,
});

const emit = defineEmits(['focus', 'blur']);

const { getMaskedString } = useMask();

const { errorMessage, handleBlur, handleChange, meta, setValue, value } = useField(props.name);

const isPassword = reactive({ value: true, blockIcon: true });

const togglePassword = () => {
  isPassword.value = !isPassword.value;
  isPassword.blockIcon = false;
};

const inputValueUnmasked = ref<string>('');

// Allows to not defined the mask prop
const noMask = { mask: '*'.repeat(255), tokens: { '*': { pattern: /./ } } };

watch(
  () => {
    props.effectValue;
  },
  () => {
    let inputValue = props.effectValue;

    if (props.mask) {
      inputValue = getMaskedString(typeof inputValue === 'number' ? inputValue.toFixed(2) : props.effectValue, props.mask);
    }
    setValue(inputValue);
  },
  { deep: true }
);

const { setInputValidState } = useInputValidState();
const { setFormCurrentValueState } = useFormValidState();

const inputType = isPassword.value ? 'text' : props.type;

const handleInputChange = (event: Event) => {
  handleChange(event);

  setFormCurrentValueState(props.name, inputValueUnmasked);
};

const focusHandler = () => {
  emit?.('focus');
};
const blurHandler = () => {
  emit?.('blur');
  handleBlur();
};




const image = ref();

onMounted( async () => {
  
  image.value = await useContentfulImage('11hRBxLH8LvasVBMZcVc0h')
  
});

</script>
<template>
  <div class="theme-input-wrapper">
    <BaseSkeletonLoader :is-loading="props.isLoading" :rows="[{ col: 3 }]">
      <div v-if="optionalText" class="theme-input-label-wrapper">
        <label
          :data-testid="`${props.dataTestId}-${inputType}-input-label`"
          :for="props.id"
          class="form-label"
        >
          {{ label }}
        </label>
        <p
          v-if="props.optionalText"
          :data-testid="`${props.dataTestId}-${inputType}-input-optional-text`"
          class="form-text"
        >
          {{ props.optionalText }}
        </p>
      </div>
      <label
        v-else
        :data-testid="`${props.dataTestId}-${inputType}-input-label`"
        :for="props.id"
        class="form-label"
      >
        {{ props.label }}
      </label>
      <slot name="icon"></slot>
    </BaseSkeletonLoader>
    <div class="theme-input-icon-wrapper">
      <div
        v-if="props.type === 'password'"
        :data-testid="`${props.dataTestId}-password-input-toggle`"
        class="theme-input-icon"
        @click="togglePassword"
        @keypress="togglePassword"
      >
        <BaseIcon
          v-if="isPassword.value"
          :color="Colors.Black"
          :name="IconNames.EyeOff"
          :size="IconSizes.Medium"
        />
        <BaseIcon
          v-else
          :color="Colors.Black"
          :name="IconNames.Eye"
          :size="IconSizes.Medium"
        />
      </div>
      <div v-else class="theme-input-icon">
        <BaseIcon
          v-if="props.type === 'search' || (!errorMessage && value)"
          :color="Colors.Black"
          :name="IconNames[props.type === 'search' ? 'Search' : 'Check']"
          :size="IconSizes.Medium"
        />
      </div>
      <img v-if="props.flagIcon" class="flag-icon" :src="image?.url" :alt="image?.altText"/>
      <input
        :id="props.id"
        v-maska="props.mask || noMask"
        :class="[
          {
            'is-active': props.isActive,
            'not-valid': errorMessage,
            'flag-input': props.flagIcon,
          },
          'is-password',
          'form-control',
          'golden-border',
        ]"
        :aria-describedby="props.id"
        :aria-invalid="!!errorMessage"
        :data-testid="`${props.dataTestId}-${inputType}-input`"
        :disabled="props.isDisabled"
        :masked="!!props.mask"
        :maxlength="props.maxLength"
        :name="props.name"
        :readonly="props.isReadOnly"
        :type="props.type === 'password' && isPassword.value ? props.type : 'text'"
        :autocomplete="props.autoComplete"
        :value="value"
        required
        @blur="blurHandler"
        @input="handleInputChange"
        @focus="focusHandler"
        @maska="inputValueUnmasked = $event.target?.dataset?.maskRawValue"
      />
    </div>
    <p
      v-if="props.hint"
      class="form-text"
      :data-testid="`${props.dataTestId}-${inputType}-input-hint`"
    >
      {{ props.hint }}
    </p>
    <div v-if="errorMessage" class="theme-validation">
      <p
        class="help-message invalid-feedback"
        :data-testid="`${props.dataTestId}-${inputType}-input-error`"
      >
        <BaseIcon
          :color="Colors.AARed"
          :name="IconNames.AlertCircle"
          :size="IconSizes.Small"
        />
        {{ errorMessage }}
      </p>
    </div>
    {{ getError ? setInputValidState(meta.valid) : null }}
  </div>
</template>
<style scoped>
.flag-icon {
  position: absolute;
  width:21px;
  height:15px;
  left: 16px;
  top: 35%;
}
.flag-input {
  padding-left: 48px;
}
.golden-border:focus {
  border: 2px solid #ffc429;
  z-index: 10000;
}
</style>
