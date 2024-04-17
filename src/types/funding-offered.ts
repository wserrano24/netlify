import { FundingOptionsSelectOptions } from '@/constants/funding-offered';
import { IStoreList } from '@/utils/stores';

type FundingOption = {
  available?: boolean;
};

export type AccountDetailsFundingOption = FundingOption & {
  accountMaskedValue?: string;
};

export type PickUpInStoreFundingOption = FundingOption & {
  store?: IStoreList;
};

export type DebitCardFundingOption = FundingOption & {
  // TODO: Update when we get actual response from service
  cardId?: string;
  cardMaskedValue?: string;
};

export type FundingOptionType =
  | FundingOptionsSelectOptions.Account
  | FundingOptionsSelectOptions.Debit
  | FundingOptionsSelectOptions.PickUpInStore;

type DisbursementResponse = {
  skipRepaymentOptions?: boolean;
};

export interface SelectDisbursementMethodPayload {
  fundingOption: FundingOptionType;
  cardId?: string;
}

export interface DisbursementSelectedResponse {
  data?: DisbursementResponse;
  errors?: Record<string, unknown>;
  meta?: Record<string, unknown>;
}

type FundingOptionResponseData = {
  ACH?: AccountDetailsFundingOption;
  DEBIT?: Record<string, unknown>;
  'DEBIT-IN-STORE'?: Record<string, unknown>;
  'PICKUP-STORE'?: PickUpInStoreFundingOption;
};

export interface FundingOptionsResponse {
  data?: FundingOptionResponseData;
  errors?: Record<string, unknown>;
  meta?: Record<string, unknown>;
}
