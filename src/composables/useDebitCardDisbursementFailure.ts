import { ref } from "vue";

const disbursementFailure = ref<any>(false);

export const useDebitCardDisbursementFailure = () => {


  const updateDisbursementFailureState = (state: boolean): void => {
    disbursementFailure.value = state;
  };

  return {
    updateDisbursementFailureState,
    isFailure: disbursementFailure?.value,
  };
};
