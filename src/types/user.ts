export type UserHomeAddress = {
  active?: boolean;
  address1: string;
  address2?: string;
  address3?: string;
  addressType?: string;
  city?: string;
  dateCreated?: string;
  dateModified?: string;
  purposeId?: string;
  stateCode?: string;
  zipCode?: string;
};

export type UserPersonalData = {
  currentPhone?: string;
  dateOfBirth?: string;
  driversLicense?: string;
  driversLicenseExpiration?: string;
  driversLicenseState?: string;
  firstName?: string;
  lastName?: string;
  smsOptin?: boolean;
  ssn?: string;
};

export interface UserProfileData {
  homeAddress: UserHomeAddress;
  isSaveAndExit?: boolean;
  personalData: UserPersonalData;
  saveAndExitData?: Record<string, unknown>;
  userData?: UserHomeAddress;
}
