export interface PaymentOption {
    paymentOption: string;
    minAmount: number;
    maxAmount: number;
  }
export interface PaymentDetail {
    paymentOption: string;
    paymentAmount: number;
    paymentDate: string;
    tenderType: string;
    cardReferenceId: string;
    productId: string;
    purposeId: string;
  }
export interface TenderObject {
    value: string;
    validDates: Array<string>;
    accountEnding: string;
    tenderType: string;
    referenceId: string;
  }
  
export interface Account {
    tenderOptionId: string;
    tenderDescription: string;
    referenceId: string;
    accountEnding: string;
  }
  
export interface TenderOption {
    accounts: Array<Account>;
    tenderType: string;
    validDates: Array<string>;
  }