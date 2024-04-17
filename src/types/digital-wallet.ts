export type PaymentMethodInfoFilters = {
  canDelete?: boolean;
  canUpdate?: boolean;
  canUseAsCollateral?: boolean;
  canUseAsDisbursement?: boolean;
  canUseAsPayment?: boolean;
  expired?: boolean;
};

export type PaymentMethodInfo = PaymentMethodInfoFilters & {
  accountEnding: string;
  accountId?: string;
  accountType: string;
  bankName?: string;
  cardType: string;
  expirationDate: string;
};

export type WalletEntry = PaymentMethodInfo & {
  isBank?: boolean;
  isCard?: boolean;
  label?: string;
};
export interface PaymentMethods {
  cards: WalletEntry[];
  isDataLoaded: boolean;
}

export interface BankAccessInfo {
  canUpdate: boolean;
  canDelete: boolean;
  isBankAccountExist: boolean;
}

export interface DigitalWalletResponse {
  accounts: PaymentMethodInfo[];
}
