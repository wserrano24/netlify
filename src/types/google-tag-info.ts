/* eslint-disable */
export interface EligibleTransaction {
  canMakePayment?: boolean;
  isEligibleToReApply?: boolean;
  isEligibleToWithdraw?: boolean;
  isEligibleforRefinance?: boolean;
  canCancelRefinance?: boolean;
  isInstallmentPlusEligible?: boolean;
  isEligibleForLineIncrease?: boolean;
  isEligibleforLOCRates?: boolean;
  isEPPInitiated?: boolean;
}

export interface GoogleProductObject {
  productId: string;
  productStatus: string;
  eligibleTransaction: EligibleTransaction;
}

export interface GoogleAppObject {
  purposeId: string;
  applicationId: string;
  hubspotId?: string;
  appState: string;
}

export interface GoogleProductsArray extends Array<GoogleProductObject> {}

export interface GoogleApplicationsArray extends Array<GoogleAppObject> {}
