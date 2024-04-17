import { ref } from "vue";

const errors = ref<any>(null);

export const useErrorMessages = () => {

  const updateErros = (errorMessages: { [key: string]: string }): void => {

    if (!errorMessages) return;
    errors.value = errorMessages;
  };

  return {
    errors: errors.value,
    updateErros,
  };
};
