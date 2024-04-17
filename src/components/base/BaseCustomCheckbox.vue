<script setup lang="ts">
import { useFormValidState } from '@/composables/useFormValidState';
import { useField } from 'vee-validate';
import { ref, watch } from 'vue';
import BaseSkeletonLoader from './BaseSkeletonLoader.vue';

interface Props {
  dataTestId: string;
  id: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isInvalid?: boolean;
  label?: string;
  effectValue?: boolean;
  name: string;
}

const props = withDefaults(defineProps<Props>(), {
  isDisabled: false,
  effectValue: false,
  isInvalid: false,
  label: '',
});

const input = ref<any>(null);

const { value, errorMessage, handleChange } = useField(props.name);

const { setFormCurrentValueState } = useFormValidState();

const reactiveValue = ref(props?.effectValue);

const emit = defineEmits(['checkbox-clicked']);

function toggleValue() {
  emit('checkbox-clicked', input.value.checked);
  reactiveValue.value = input.value.checked;
  handleChange(reactiveValue.value);

  setFormCurrentValueState(props.name, reactiveValue.value);
}

watch(
  () => {
    props.effectValue;
  },
  () => {
    value.value = props.effectValue;
    input.value.checked = props.effectValue;
  },
  { deep: true }
);
</script>

<template>
  <BaseSkeletonLoader :is-loading="props.isLoading" :rows="[{ col: 5 }]">
    <div
      id="checkbox-div"
      :class="props.isInvalid ? 'error' : reactiveValue ? 'checked' : 'checkbox'"
    >
      <label
        class="label"
        :for="props.id"
        :data-testid="`${props.dataTestId}-checkbox-label`"
      >
        <input
          :id="props.id"
          ref="input"
          :class="props.isInvalid ? 'error' : reactiveValue ? 'checked' : ''"
          type="checkbox"
          :value="reactiveValue"
          :checked="reactiveValue"
          :name="props.name"
          :disabled="props.isDisabled"
          :aria-describedby="props.id"
          :data-testid="`${props.dataTestId}-checkbox-input`"
          @click="toggleValue"
        />
        {{ props.label }}
      </label>
      <slot />
    </div>
    <div v-if="errorMessage" class="theme-validation">
      <p
        class="help-message invalid-feedback"
        :data-testid="`${props.dataTestId}-checkbox-error`"
      >
        {{ errorMessage }}
      </p>
    </div>
  </BaseSkeletonLoader>
</template>

<style scoped>
html {
  box-sizing: border-box;
}
.checkbox input[type='checkbox'] {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 0.2em;
  border: 2px solid #0e406a;
  background-color: #fff;
  cursor: pointer;
  position: relative;
  display: block;
}

input.checked {
  content: '\2713';
  color: #fff;
  font-size: 14px;
  line-height: 1;
  width: 18px !important;
  height: 18px !important;
  bottom: 2px;
  position: relative;
  display: flex;
  border-radius: 0.2em;
  border: 2px solid #0e406a;
  background-color: #0e406a;
}
input.checked::before {
  content: '\2713';
  color: #fff;
  width: 18px !important;
  height: 18px !important;
  position: relative;
  line-height: 1;
  vertical-align: bottom;
  display: inline;
  border-radius: 0.2em;
  border: 2px solid #0e406a;
  background-color: #0e406a;
}

.error input[type='checkbox'] {
  -webkit-appearance: none;
  appearance: none;
  width: 18px !important;
  height: 18px !important;
  border-radius: 0.2em;
  border: 2px solid #d4353f;
  background-color: #fff;
  cursor: pointer;
  position: relative;
  bottom: 0.08em;
  display: flex;
}
</style>