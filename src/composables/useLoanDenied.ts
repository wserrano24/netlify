import { computed, ref } from "vue";

interface LoanDenied {
  documentId?: string;
  productId?: string;
}

const INITIAL_STATE: LoanDenied = {
  documentId: null,
  productId: null,
};

export const useLoanDenied = () => {
  const loanDenied = ref(INITIAL_STATE);

  const updateLoanDeniedInfo = (documentId: string, productId: string) => {
    loanDenied.value.documentId = documentId;
    loanDenied.value.productId = productId;
  };

  return {
    updateLoanDeniedInfo,
    deniedDocumentId: computed(() => loanDenied?.value?.documentId),
    deniedProductId: computed(() => loanDenied?.value?.productId),
  };
};
