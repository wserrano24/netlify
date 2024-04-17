import useComposite from "@/composables/useComposite";

const {
  getPaymentDetailsByDateInstallment,
  getPaymentDetailsByDatePayday,
  getPaymentDetailsInstallment,
  getPaymentDetailsPayday,
  postPaymentDetailsInstallment,
  postPaymentDetailsPayday,
} = useComposite();

export enum ProductType {
  ILP = 'Installment loan',
  PDL = 'Payday loan',
  LOC = 'Line of Credit'
}

export enum ApplicationStatus {
  PREPARING = 'PREPARING',
  SUBMITTED = 'SUBMITTED',
  DENIED = 'DENIED',
  PENDING_ESIGN = 'PENDING_ESIGN',
  COMPLETE = 'COMPLETE',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACTION_PENDING = 'ACTION_PENDING',
  CANCELLED = 'CANCELLED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
}

export type ProductUnionType = `${ProductType}`;

export interface ProductSummary {
  achInFlight: boolean;
  applicationStatus: string;
  autoPay: string;
  availableCredit: number;
  balanceAmount: string;
  balanceStatus?: string;
  creditLimit: number;
  dueDate: string;
  isActive?: boolean;
  loanAmount: string;
  loanNumber: string;
  pastDue: boolean;
  paymentAmtDue: string;
  productId: string;
  channelCode: 'ONLINE' | 'STORE'
  productStatus: 'Open' | 'Closed' | 'Write Off';
  productType: ProductUnionType;
  schedulePayments: {
    scheduledPaymentAmount: number;
    scheduledPaymentDate: string;
    scheduledPaymentFlag: string;
    scheduledPaymentType: string;
  };
  eligibleTransaction: {
    canCancelRefinance: boolean;
    canMakePayment: boolean;
    isEligibleForLineIncrease: boolean;
    isEligibleforLOCRates: boolean;
    isEligibleforRefinance: boolean;
    isEligibleToReApply: boolean;
    isEligibleToWithdraw: boolean;
    isEPPInitiated: boolean;
    isInstallmentPlusEligible: boolean;
  };
}

export interface ApplicationSummary {
  applicationId: string;
  channelCode: string;
  dateCreated: string;
  dateModified: string;
  exitReason: string | null;
  fundingOption: string;
  incomplete: boolean;
  lastApplicationPage: string | null;
  leadLandingUrl: string;
  productType: ProductUnionType;
  purposeId: string;
  qfundApplicationId: string;
  qfundCustomerId: string;
  repaymentMethod: string;
  requestedLoanAmount: string;
  state: string;
  submittedDate: string;
  subStatus: string;
  isRefinanceApp: boolean;
  refinance: {
    originalProductId: string;
    payDownAmount: number;
    refiPaymentDate: string;
    dueDate: string;
    disbAmount: number;
  };
}

export interface LoanTrackerResponse {
  acctLastFourDigit: string;
  applicationApprovalDate: string;
  bannerExpiryDate: string;
  estimatedArrivalDate: string;
  fundingMethodType: any;
  fundingStatus: 'ARRIVED';
  state: `${ApplicationStatus}`;
  submittedDate: string;
}

export const ProductConfigurationsByType = {
  [ProductType.PDL]: {
    endpoints: {
      postPaymentDetails: postPaymentDetailsPayday,
      getPaymentDetails: getPaymentDetailsPayday,
      getPaymentDetailsByDate: getPaymentDetailsByDatePayday,
    },
  },
  [ProductType.ILP]: {
    endpoints: {
      postPaymentDetails: postPaymentDetailsInstallment,
      getPaymentDetails: getPaymentDetailsInstallment,
      getPaymentDetailsByDate: getPaymentDetailsByDateInstallment,
    },
  },
};
