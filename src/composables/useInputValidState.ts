import { computed, ref } from "vue";

const validState = ref<any>(false);
export const useInputValidState = () => {
  

  function setInputValidState(value: boolean) {
    validState.value = value;
  }

  return {
    getInputValidState: computed(() => validState.value),
    setInputValidState,
  };
};
