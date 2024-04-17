export interface RepaymentOptionResponse {
  ACH: {
    accountMaskedValue: string;
    available: boolean;
  };
  DEBIT: {
    available: boolean;
    cardId: string;
    cardMaskedValue: string;
  };
  RCC: {
    available: boolean;
  }
}

export interface RepaymentOptionPayload {
  cardId?: string;
  repaymentOption: 'ACH' | 'DEBIT' | "RCC";
}
