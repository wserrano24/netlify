interface ErrorLinks {
  about: string;
}
interface Errors {
  code: string;
  detail: string;
  id: string;
  links: ErrorLinks[];
  meta: string;
  source: string;
  status: string;
  title: string;
}

export interface LeadGenData {
  data: {
    appSource: string;
    applicationId: string;
    applicationStatus: string;
    approvedAmount: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    productType: string;
    purposeId: string;
    purposeToken: string;
    stateCode: string;
    zipCode: string;
    errors: Errors[];
  };
}
