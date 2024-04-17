import { LoanOffer } from '@/types/LoanOffer';
import { defineStore } from 'pinia';
interface noOfPayments {
  label: number;
  value: number;
}

interface State {
  flow: 'PDL' | 'ILP' | 'LOC' | null;
  isRepeatCustomer: boolean;
  isMultipleDebit: boolean;
  applicationId: number;
  productId: number;
  inStore: boolean;
  selectedLoanAmount: number;
  noOfPaymentsArray: Array<noOfPayments>;
  selectedNoOfPayments: number;
}

//Default flow for ILP, PDL and LOC can be added in the future
const state = (): State => ({
  flow: null,
  isRepeatCustomer: false,
  isMultipleDebit: false,
  applicationId: null,
  productId: null,
  inStore: false,
  selectedLoanAmount: null,
  noOfPaymentsArray: null,
  selectedNoOfPayments: null,
});
//if repeat customer is true - load repeat customer origination flow
//if multiple debit is true, then load multiple debit flow.
//if both false then load normal ILP flow
// testing merge with this comment

const actions = {
  setFlow(string) {
    this.flow = string;
  },
  clearFlow() {
    this.flow = null;
  },
  setIsRepeatCustomer(bool) {
    this.isRepeatCustomer = bool;
  },
  setIsMultipleDebit(bool) {
    this.isMultipleDebit = bool;
  },
  setApplicationId(number) {
    this.applicationId = number;
  },
  setProductId(number) {
    this.productId = number;
  },
  setInStore(boolean) {
    this.inStore = boolean;
  },
  setSelectedLoanAmount(number) {
    this.selectedLoanAmount = number;
  },
  setNoOfPaymentsArray(array) {
    this.noOfPaymentsArray = array;
  },
  setSelectedNoOfPayments(number) {
    this.selectedNoOfPayments = number;
  },
  clearOriginationValues() {
    this.inStore = false;
    this.selectedLoanAmount = null;
    this.noOfPaymentsArray = null;
    this.selectedNoOfPayments = null;
    this.offerStoreData = null;
  },
};

const getters = {
  getFlow: (state: State) => state.flow,
  getIsRepeatCustomer: (state: State) => state.isRepeatCustomer,
  getIsMultipleDebit: (state: State) => state.isMultipleDebit,
  getApplicationId: (state: State) => state.applicationId,
  getProductId: (state: State) => state.productId,
  getInStore: (state: State) => state.inStore,
  getSelectedLoanAmount: (state: State) => state.selectedLoanAmount,
  getNoOfPaymentsArray: (state: State) => state.noOfPaymentsArray,
  getSelectedNoOfPayments: (state: State) => state.selectedNoOfPayments,
};

export default defineStore('useOriginationStore', {
  state,
  actions,
  getters,
});
