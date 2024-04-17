import { computed, ref } from "vue";

/**
 * @function getValidIncomes - will give array of valid incomes
 * @param data - income data
 * @returns {Array} - array of valid incomes
 */
const getValidIncomes = (data) => [...data].filter((income) => income?.isValid);

const validState = ref<any>();
export const useIncomeState = () => {


  function setIncomeState(data) {
    validState.value = getValidIncomes(data);
  }

  return {
    getIncomeState: computed(() => validState.value),
    setIncomeState,
  };
};
