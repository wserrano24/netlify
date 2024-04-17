export const enum FundingMethodType {
  BANK_ACCOUNT = 'BANK-ACCOUNT',
  DEBIT_CARD = 'DEBIT-CARD',
  STORE_PICKUP = 'STORE-PICKUP',
}

export const enum FundingTrackerStatus {
  ARRIVED = 'ARRIVED',
  IN_PROGRESS = 'IN-PROGRESS',
}

export interface LoanTrackerResponse {
  acctLastFourDigit: string;
  applicationApprovalDate: string;
  bannerExpiryDate: string;
  estimatedArrivalDate: string;
  fundingMethodType: `${FundingMethodType}`;
  fundingStatus: `${FundingTrackerStatus}`;
}
