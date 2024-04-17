export type ProductCode = 'PDL' | 'ILP' | 'LOC';

export interface LoanOffer {
  purposeId: string;
  applicationId: string;
  channel: string;
  payFreq: string;
  maxLoanAmount?: number;
  minLoanAmount?: number;
  collateralType: string;
  stateCode: string;
  loanAmountIncrement: number;
  isConditionallyApproved?: boolean;
  offers?: Array<OffersEntity>;
}

export interface OffersEntity {
  isRefinance: boolean | null;
  refinance: {
    disbAmount: number;
    payOffAmount: number;
    previousLoanNumber: number;
    payDownAmount: number;
    refiPaymentDate: string;
    loanAmountIncrement: number;
    stepUpAllowed: boolean;
  } | null;
  offerId: string;
  channel: string;
  minLoanAmount: number;
  maxLoanAmount: number;
  excludedMinLoanAmount: number;
  excludedMaxLoanAmount: number;
  loanAmountIncrement: number;
  productType: ProductCode;
  loancount?: number;
  interestRate?: number;
  availableDueDates?: [Array<AvailableDueDatesEntity>];
  defaultDueDate: string;
  minApr: MinAprOrMaxApr;
  maxApr: MinAprOrMaxApr;
  availableNoOfPayments?: Array<number>;
}

export interface AvailableDueDatesEntity {
  paymentDueDate: string;
  loanTerm: number;
}

export interface MinAprOrMaxApr {
  productCode?: ProductCode | string;
  aprPercent?: number;
  loanAmount: number;
  aprEstimatedAmount: number;
  aprEstimatedTotalAmount?: number;
  aprFirstPaymentDueDate: string;
  numberOfPayments: number;
}

export interface AprPayload {
  maxDesiredAmount: number;
  minDesiredAmount: number;
  ILP: {
    numberOfPayments: number;
    loanCount: number;
  };
  PDL: {
    loanTerm: number;
  };
  LOC: {
    drawAmount: number;
  }
}

export interface AprProperties {
  aprEstimatedAmount: number;
  aprEstimatedTotalAmount: number;
  aprFirstPaymentDueDate: string;
  aprPercent: number;
  loanAmount: number;
  numberOfPayments: number;
  productCode: ProductCode | string;
}

export interface SelectProduct {
  offerId: string;
  requestedLoanAmount: number;
  noOfPayments: number;
  dueDate: string;
  requestedDrawAmount?: number;
}

export interface APRMain {
  ILP: {
    availableNoOfPayments: Array<number>;
    termAvaliable: boolean;
    values: Array<AprProperties>;
  };
  PDL: {
    values: Array<AprProperties>;
  };
  LOC: {
    values: Array<AprProperties>;
  };
}
