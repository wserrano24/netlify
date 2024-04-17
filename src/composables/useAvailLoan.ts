import { computed, ref } from "vue";

type AvailableLoan = {
  productCode: string;
  productName: string;
  productType: string;
  minLoanAmount: number;
  maxLoanAmount: number;
  eligibilityStatus: string;
  ineligibleReason: string;
};

type AvailLoan = {
  availLoanList: [AvailableLoan];
  coolOffDate?: string;
  firstName: string;
  isCoolOff?: boolean;
  lastName: string;
  showCard: string;
};

type AvailLoanData = {
  data: AvailLoan;
  errors?: string;
  meta?: string;
};
const availLoan = ref<any>(null);

export default () => {

  function setAvailLoanData(value: AvailLoanData) {
    availLoan.value = value;
  }
  return {
    getAvailLoan: computed(() => availLoan.value),
    setAvailLoanData,
  };
};
