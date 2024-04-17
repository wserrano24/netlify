import { ref } from "vue";

export const useOktaProperties = () => {

  const properties = ref();
  
  const updateProperties = (propertiesValues: {
    [key: string]: string;
  }): void => {
    if (!propertiesValues) return;

    properties.value = propertiesValues;
  };

  return {
    properties: properties.value,
    updateProperties,
  };
};
