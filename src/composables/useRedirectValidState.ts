import { computed, ref } from "vue";


const validState = ref();
export const useRedirectValidState = () => {


  function setRedirectValidState(value: null | boolean) {
    validState.value = value;
  }

  return {
    getRedirectValidState: computed(() => validState.value),
    setRedirectValidState,
  };
};
