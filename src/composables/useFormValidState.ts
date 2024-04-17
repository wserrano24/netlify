import { computed, ref } from 'vue';
import { AnyObject } from 'yup/lib/types';

const validState = ref(false);
const loadingState = ref();
const formInitialValueState = ref();
const formCurrentValueState = ref();

export const useFormValidState = () => {

  function setFormValidState(value: boolean) {
    validState.value = value;
  }

  function setLoadingState(value: boolean) {
    loadingState.value = value;
  }

  function setFormInitialValueState(value: AnyObject) {
    formInitialValueState.value = { ...value };
  }

  function setFormCurrentValueState(key: string, value: unknown) {
    if (!formCurrentValueState.value) {
      formCurrentValueState.value = {};
    }

    formCurrentValueState.value[key] = value;
  }

  const isFormDirty = computed(() => {
    for (const key in formCurrentValueState.value) {
      if (
        Object.prototype.hasOwnProperty.call(formCurrentValueState.value, key)
      ) {
        const currentValue = formCurrentValueState.value[key];
        const originalValue = formInitialValueState.value?.[key];
        if (currentValue !== originalValue) {
          return true;
        }
      }
    }
    return false;
  });

  const resetFormStates = () => {
    formInitialValueState.value = {};
    formCurrentValueState.value = {};
  };

  return {
    getFormDirtyState: computed(() => formInitialValueState.value),
    getFormLoadingState: computed(() => loadingState.value),
    getFormValidState: computed(() => validState.value),
    isFormDirty,
    resetFormStates,
    setFormCurrentValueState,
    setFormInitialValueState,
    setFormValidState,
    setLoadingState,
  };
};
