import { ProductSummary } from '../constants/product';
import { defineStore } from 'pinia';

interface EsignPendingDetails {
  hasBeenEsigned: boolean;
  productType: string;
  applicationId: string;
}

interface State {
  productId?: string;
  productType?: string;
  paymentAmount?: string;
  paymentType?: string;
  paymentDate?: string;
  product?: ProductSummary;
  firstName?: string;
  preApproved?: boolean;
  esignPendingDetails: EsignPendingDetails;
  hasReviewedDisclosures: boolean;
  alPaydownAmt: number;
  isEpp: boolean;
}

const state = (): State => ({
  productId: null,
  productType: null,
  paymentAmount: null,
  paymentType: null,
  paymentDate: null,
  product: null,
  firstName: null,
  preApproved: false,
  esignPendingDetails: {
    hasBeenEsigned: false,
    productType: '',
    applicationId: '',
  },
  hasReviewedDisclosures: false,
  alPaydownAmt: 0,
  isEpp: false,
});

const actions = {
  setProduct(product: ProductSummary) {
    this.product = product;
    this.productId = product.productId;
    this.paymentAmount = product.paymentAmtDue;
    this.paymentType = product.productType;
    this.paymentDate = product.dueDate;
  },

  setProductId(id: string) {
    this.productId = id;
  },
  setProductType(string) {
    this.productType = string;
  },
  setPaymentAmount(amount: string) {
    this.paymentAmount = amount;
  },
  setPaymentType(amount: string) {
    this.paymentType = amount;
  },
  setPaymentDate(amount: string) {
    this.paymentDate = amount;
  },
  setFirstName(name: string) {
    this.firstName = name;
  },
  setPreapproved(boolean) {
    this.preApproved = boolean;
  },
  setEsignPendingDetails(
    hasBeenEsigned: boolean,
    productType: string,
    applicationId: string
  ) {
    this.esignPendingDetails.hasBeenEsigned = hasBeenEsigned;
    this.esignPendingDetails.productType = productType;
    this.esignPendingDetails.applicationId = applicationId;
  },
  clearEsignPendingDetails() {
    this.hasBeenEsigned = false;
    this.productType = '';
    this.applicationId = '';
  },
  setHasReviewedDisclosures(boolean) {
    this.hasReviewedDisclosures = boolean;
  },
  clearHasReviewedDisclosures() {
    this.hasReviewedDisclosures = false;
  },
  setAlPaydownAmt(amt: number) {
    this.alPaydownAmt = amt;
  },
  setIsEpp(val: boolean) {
    this.isEpp = val;
  }
};

const getters = {
  getProductId: (state: State) => state.productId,
  getProductType: (state: State) => state.productType,
  getProduct: (state: State) => state.product,
  getPaymentAmount: (state: State) => state.paymentAmount,
  getPaymentType: (state: State) => state.paymentType,
  getPaymentDate: (state: State) => state.paymentDate,
  getFirstName: (state: State) => state.firstName,
  getPreApproved: (state: State) => state.preApproved,
  getEsignPendingDetails: (state: State) => state.esignPendingDetails,
  getHasReviewedDisclosures: (state: State) => state.hasReviewedDisclosures,
  getAlPaydownAmt: (state: State) => state.alPaydownAmt,
  getIsEpp: (state: State) => state.isEpp,
};

export default defineStore('useProductStore', {
  state,
  actions,
  getters,
});
