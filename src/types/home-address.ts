export type AddressService = {
  address1?: string;
  city?: string;
  stateCode?: string;
  zipCode?: string;
};

type Address = {
  address?: string;
  address2?: string;
  prefilledAddress?: boolean;
  PostalCode?: string;
  service?: AddressService;
};

export type AddressData = {
  pending?: boolean;
  data?: Address;
};
