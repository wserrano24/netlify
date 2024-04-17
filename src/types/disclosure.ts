export type Disclosure = {
  id: string;
  label: string;
};

export enum DisclosureType {
  DEFAULT = 'DEFAULT',
  LOAN = 'LOANDISC',
  PRE_LOAN = 'PRELOAN',
}

export type CreateAndSubmitResponse = {
  isApproved?: boolean;
  isConditionallyApproved?: boolean;
  isDenied?: boolean;
  applicationId?: string;
  documentId?: string;
  productId?: string;
  isCanceled: boolean;
};
