<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';
import { useField } from 'vee-validate';
import { computed, reactive, watchEffect } from 'vue';
import BaseSkeletonLoader from './BaseSkeletonLoader.vue';
import BaseIcon from './BaseIcon.vue';

interface Props {
  checkedValue?: string;
  dataTestId: string;
  id: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isValidateDisabled?: boolean;
  label?: string;
  name: string;
  value?: string;
}

const props = withDefaults(defineProps<Props>(), {
  checkedValue: '',
  isDisabled: false,
  isValidateDisabled: true,
  label: '',
  value: '',
});

const emit = defineEmits(['click']);

const isChecked = reactive({ value: false });

const { errorMessage, handleChange } = useField(props.name);

watchEffect(() => {

  if (props.checkedValue === props.value) {
    isChecked.value = true;
    //handleChange(props.value);
  } else {
    isChecked.value = false;
  }

});

const cxRadio = computed(() => [
  'form-check',
  'pf-radio',
  isChecked.value && 'pf-checked',
]);

function clickHandler() {
  emit('click', props.value);
  handleChange(props.value);
}
</script>
<template>
  <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
  <div :class="cxRadio" @click="clickHandler">
    <BaseSkeletonLoader :is-loading="props.isLoading" :rows="[{ col: 3 }]">
      <input
        :id="props.id"
        class="form-check-input"
        type="radio"
        :name="props.name"
        :value="props.value"
        :disabled="props.isDisabled"
        :checked="isChecked.value"
        :data-testid="`${props.dataTestId}-radio-input`"
      />
      <label
        class="form-check-label"
        :for="props.id"
        :data-testid="`${props.dataTestId}-radio-label`"
      >
        {{ label }}
      </label>
    </BaseSkeletonLoader>
  </div>
  <div v-if="errorMessage && props.isValidateDisabled" class="theme-validation">
    <p
      class="help-message invalid-feedback"
      :data-testid="`${props.dataTestId}-radio-error`"
    >
      <BaseIcon
        :color="Colors.AARed"
        :name="IconNames.AlertCircle"
        :size="IconSizes.Small"
      />
      {{ errorMessage }}
    </p>
  </div>
</template>
