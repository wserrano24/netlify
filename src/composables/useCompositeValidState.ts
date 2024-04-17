import { computed, ref } from "vue";

const validState = ref<any>(null);

export const useCompositeValidState = () => {


  function setCompositeValidState(value: null | string) {
    validState.value = value;
    validState.value;
  }

  return {
    getCompositeValidState: computed(() => validState.value),
    setCompositeValidState,
  };
};
