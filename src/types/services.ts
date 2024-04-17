export interface BankComposite {
  bankName?: string;
  bankReferenceId?: string;
  checkingAccNumber?: string;
  confirmCheckingAccNumber?: string;
  isActive?: boolean;
  routingNumber?: string;
}

export interface IncomeSources {
  incomeSources?: BankComposite;
}

export interface UserData {
  data?: IncomeSources;
  existingData: boolean;
  pending: boolean;
}
