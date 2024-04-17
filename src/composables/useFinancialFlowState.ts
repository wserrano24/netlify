import { computed, ref } from "vue";

const jobStatus = ref();
const paymentFrequency = ref();
export const useFinancialFlowState = () => {

  function setJobStatus(value) {
    jobStatus.value = value;
  }

  function setPaymentFrequency(value) {
    paymentFrequency.value = value;
  }

  return {
    getJobStatus: computed(() => jobStatus.value),
    getPaymentFrequency: computed(() => paymentFrequency.value),
    setJobStatus,
    setPaymentFrequency,
  };
};
