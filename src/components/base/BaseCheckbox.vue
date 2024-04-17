<script setup lang="ts">
import { IconNames, IconSizes } from '@/constants/icons';
import { Colors } from '@/constants/colors';
import { useField } from 'vee-validate';
import { ref, watch } from 'vue';
import { useFormValidState } from '@/composables/useFormValidState';
import BaseSkeletonLoader from './BaseSkeletonLoader.vue';
import BaseIcon from './BaseIcon.vue';

interface Props {
  dataTestId: string;
  id: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isInvalid?: boolean;
  label?: string;
  effectValue?: boolean;
  reset?: boolean;
  name: string;
  changedColor?: boolean;
  size: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isDisabled: false,
  effectValue: false,
  reset: false,
  isInvalid: false,
  label: '',
  changedColor: false,
  size: false,
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

function resetToDefaultProps() {
  reactiveValue.value = props.effectValue;
  value.value = props.effectValue;
  input.value.checked = props.effectValue;
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

watch(
  () => {
    props.reset;
  },
  () => {
    if (props.reset) {
      resetToDefaultProps();
    }
  },
  { deep: true }
);
</script>

<template>
  <BaseSkeletonLoader :is-loading="props.isLoading" :rows="[{ col: 5 }]">
    <div class="form-check theme-form-checkbox">
      <input
        :id="props.id"
        ref="input"
        class="form-check-input"
        :class="[{ 'theme-form-checkbox-danger': isInvalid }, {
        'changed-color': props.changedColor,
        'fix-size': props.size
        }]"
        type="checkbox"
        :value="reactiveValue"
        :checked="reactiveValue"
        :name="props.name"
        :disabled="props.isDisabled"
        :aria-describedby="props.id"
        :data-testid="`${props.dataTestId}-checkbox-input`"
        @click="toggleValue"
      />
      <label
        class="form-check-label"
        :for="props.id"
        :data-testid="`${props.dataTestId}-checkbox-label`"
      >
        {{ props.label }}
      </label>
      <slot />
    </div>
    <div v-if="errorMessage" class="theme-validation">
      <p
        class="help-message invalid-feedback"
        :data-testid="`${props.dataTestId}-checkbox-error`"
      >
        <BaseIcon
          :color="Colors.AARed"
          :name="IconNames.AlertCircle"
          :size="IconSizes.Small"
        />
        {{ errorMessage }}
      </p>
    </div>
  </BaseSkeletonLoader>
</template>

<style scoped>
.fix-size {
  padding: 0 !important;
  height: 24px;
  width: 24px;
}
.changed-color{
  height: 20px;
  width: 20px;
  border: 2px solid #0E406A;
  background-color: #fff;
  box-shadow: none;
}

.changed-color:checked {
  border: none;
  background-color: #0E406A;
}
</style>
