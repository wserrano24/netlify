type ProductType = 'ILP' | 'LOC' | 'PDL' | 'TLP';

type LoanAgreement = {
  documentCategory?: string;
  documentDisplayName?: string;
  sequenceNo?: number;
  isLoanDoc?: boolean | null;
};

export type EsignResponseData = {
  documentId?: string;
  isDenied?: boolean;
  productId?: string;
};

export type RefiData = {
  paydownAmount?: number;
  refiPaymentDate?: string;
  refiBeforeDueDate?: boolean;
  refiDisbursementAmount?: number;
};

export interface ProductDetailResponse {
  apr?: number;
  disbursementDetails?: string;
  disbursementMethod?: string;
  drawAmount?: number;
  esignName?: string;
  estPaymentAmt?: number;
  financeCharge?: number;
  lineOfCredit?: number;
  firstPaymentDate?: string;
  loanAmount?: number;
  noOfInst?: number;
  productId?: string;
  productType?: ProductType;
  totalRepaymentAmt?: number;
  isConditionallyApproved?: boolean;
  agreements?: LoanAgreement[];
  moreDocsRequired: boolean;
  needsToBeReviewed: boolean;
  refi?: RefiData;
}

export type RefiPayment = {
  refiTenderType?: string;
  cardReferenceId?: number;
};
export interface EsignRequestPayload {
  esign: string;
  refiPayment?: RefiPayment;
}

export interface EsignResponse {
  data: EsignResponseData;
  errors?: Record<string, unknown>;
  meta?: Record<string, unknown>;
}
