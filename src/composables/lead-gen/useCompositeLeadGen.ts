import { AprPayload, AprProperties, SelectProduct } from '@/types/LoanOffer';
import {
  DisbursementSelectedResponse,
  FundingOptionsResponse,
  SelectDisbursementMethodPayload,
} from '@/types/funding-offered';
import {
  EsignRequestPayload,
  EsignResponse,
  ProductDetailResponse,
} from '@/types/loan-summary';
import {
  RepaymentOptionPayload,
  RepaymentOptionResponse,
} from '@/types/loan-repayment';
import { DigitalWalletResponse } from '@/types/digital-wallet';
import { DisclosureType } from '@/types/disclosure';
import { LeadGenData } from '@/types/lead-gen';
import { LoanOffer } from '@/types/LoanOffer';
import { Routes } from '@/constants/pages';
import useAxiosLeadGen from '@/composables/lead-gen/useAxiosLeadGen';
import { useSessionStorage } from '../useSessionStorage';
import { useRouter } from 'vue-router';
import { useDisclosure } from '../useDisclosure';

export default () => {
  /**
   * @param latestOnly
   * true will return a single record with the latest application
   * false will return several records including the latest application
   */
  
  const router = useRouter();
  const { getItem } = useSessionStorage();
  async function getDisclosureByStateLeadGen(
    state: string,
    isDisclosureForUser: boolean,
    params?: {
      disclosureType: DisclosureType;
    }
  ) {
    const { get } = await useAxiosLeadGen();

    const url = `/v1/disclosure-composite-ms/disclosure-configs/${state}/state`;

    const response = (await get(url, null, params)) as {
      data: Array<{
        disclosure: string;
        disclosureCode: string;
      }>;
    };

    return response;
  }

  async function getLeadGenData(token: string) {
    const { get } = await useAxiosLeadGen({ useAuth: false });

    const url = `/v1/lead-composite-ms/lead/data?token=${token}`;

    const response = (await get(url, { context: 'lead-gen' })) as LeadGenData;

    if (response) {
      return response.data;
    }
  }

  async function getAvailableLoanOffersLeadGen() {
    const { get } = await useAxiosLeadGen();
    const applicationId = getItem('lead-applicationId');

    const url = `/v1/application-composite-ms/applications/${applicationId}/offers`;

    const response = (await get(url, { context: 'lead-gen' })) as {
      data: LoanOffer;
    };

    return response.data;
  }

  const getLoanOffersFundingLeadGen = async () => {
    const { get } = await useAxiosLeadGen();
    const applicationId = getItem('lead-applicationId');

    const url = `/v1/application-composite-ms/applications/${applicationId}/options/funding-offered`;
    const response = (await get(url, {
      context: 'lead-gen',
    })) as FundingOptionsResponse;

    if (response.data) return response.data;
    if (response.errors) return router.push(Routes.LeadGenGeneralError);
  };

  const putLoanOffersFundingLeadGen = async (
    payload: SelectDisbursementMethodPayload,
    to: Routes | false
  ) => {
    const { put } = await useAxiosLeadGen();
    const applicationId = getItem('lead-applicationId');
    

    const url = `/v1/application-composite-ms/applications/${applicationId}/options/funding`;

    const response = (await put(url, payload, {
      context: 'lead-gen',
    })) as DisbursementSelectedResponse;

    if (response && to) {
      return router.push(to);
    }
    return response;
  };

  const getDigitalWalletDataLeadGen = async () => {
    const { get } = await useAxiosLeadGen();
    const url = '/v1/digital-wallet-composite-ms/digital-wallet';

    const response = (await get(url, { context: 'lead-gen' })) as {
      data: DigitalWalletResponse;
    };
    return response?.data;
  };

  const getLocationsByZipCodeLeadGen = async (zipCode = '', distance = 30) => {
    let stores = [];
    const { get } = await useAxiosLeadGen();
    const url = `/v1/location-composite-ms/locations/search/by-zip-code?zip-code=${zipCode}&distance=${distance}`;
    const response: any = await get(url, { context: 'lead-gen' });

    if (response && response?.data) {
      stores = response.data;
    }

    return stores;
  };

  const getStoresByCoordinatesLeadGen = async (
    latitude: number,
    longitude: number,
    distance = 500
  ) => {
    let stores = [];
    const { get } = await useAxiosLeadGen();
    const url = `/v1/location-composite-ms/locations/search/by-coordinate?latitude=${latitude}&longitude=${longitude}&distance=${distance}`;

    const response: any = await get(url, { context: 'lead-gen' });

    if (response) {
      stores = response?.data;

      return stores;
    }
  };

  async function putSelectProductLeadGen(payLoad: SelectProduct) {
    const { put } = await useAxiosLeadGen();
    const applicationId = getItem('lead-applicationId');

    const url = `/v1/application-composite-ms/applications/${applicationId}/options/product`;

    const response: any = await put(url, payLoad, { context: 'lead-gen' });

    if (response.data) return response;
    if (response.errors) return router.push(Routes.LeadGenGeneralError);
  }

  async function getLoanAprLeadGen(payLoad: AprPayload) {
    const { post } = await useAxiosLeadGen();
    const applicationId = getItem('lead-applicationId');

    const url = `/v1/application-composite-ms/applications/${applicationId}/apr`;
    const response: any = (await post(url, payLoad, { context: 'lead-gen' })) as {
      data: {
        PDL: { values: Array<AprProperties> };
        ILP: {
          availableNoOfPayments: Array<number>;
          termAvaliable: boolean;
          values: Array<AprProperties>;
        };
        LOC: { values: Array<AprProperties> };
      };
    };
    if (response.data) return response.data;
    if (response.errors) router.push(Routes.LeadGenGeneralError);
  }

  const getLoanAgreementsLeadGen = async () => {
    const { get } = await useAxiosLeadGen();
    const applicationId = getItem('lead-applicationId');
    let url = `/v1/application-composite-ms/applications/${applicationId}/agreements`;
    const isMarriedValue = getItem('IS_MARRIED_VALUE');
    if (isMarriedValue) {
      url = url + `?isMarried=${isMarriedValue}`;
    }
    const response: any = (await get(url, { context: 'lead-gen' })) as {
      data: ProductDetailResponse;
    };
    if (response.data) return response.data;
    if (response.errors) router.push(Routes.LeadGenGeneralError);
  };

  const postEsignLeadGen = async (payload: EsignRequestPayload) => {
    const { post } = await useAxiosLeadGen();
    const applicationId = getItem('lead-applicationId');
    const url = `/v1/application-composite-ms/applications/${applicationId}/esign`;
    const response = (await post(url, payload, {
      context: 'lead-gen',
    })) as EsignResponse;
    if (response) {
      return {
        ...response.data,
      };
    }
  };
  const downloadLoanAgreementLeadGen = async (
    sequenceNo: number,
    asAttachment = true
  ) => {
    const applicationId = getItem('lead-applicationId');
    const url = `/v1/application-composite-ms/applications/${applicationId}/agreements/content/${sequenceNo}?as-attachment=${asAttachment}`;
    const { get } = await useAxiosLeadGen({ responseType: 'blob' });

    const response = (await get(url, { context: 'lead-gen' })) as Blob;
    return response;
  };

  const getRepaymentOptionsLeadGen = async () => {
    const { get } = await useAxiosLeadGen();
    const applicationId = getItem('lead-applicationId');

    const url = `/v1/application-composite-ms/applications/${applicationId}/options/repayment-offered`;
    const response: any = (await get(url, { context: 'lead-gen' })) as {
      data: RepaymentOptionResponse;
    };

    if (response.data) return response.data;
    if (response.errors) router.push(Routes.LeadGenGeneralError);
  };

  const putRepaymentOptionLeadGen = async (payload: RepaymentOptionPayload) => {
    const { put } = await useAxiosLeadGen();
    const applicationId = getItem('lead-applicationId');

    const url = `/v1/application-composite-ms/applications/${applicationId}/options/repayment`;
    const response: any = await put(url, payload, { context: 'lead-gen' });
    if (response) return response;
    if (response.errors) router.push(Routes.LeadGenGeneralError);
  };

  async function postUserConsentForDisclosuresLeadGen(
    acknowledgment = true,
    type = DisclosureType.DEFAULT
  ) {
    const { getDisclosures } = useDisclosure();

    const { post } = await useAxiosLeadGen();
    const url = '/v1/disclosure-composite-ms/disclosure';
    const disclosures = await getDisclosures(type);
    const applicationId = getItem('lead-applicationId');

    const response: any = await Promise.all(
      disclosures?.map(async (disclosure: any) => {
        await post(
          url,
          {
            applicationID: applicationId,
            disclosureID: disclosure.id,
            acknowledgment,
          },
          { context: 'lead-gen' }
        );
      })
    );
    if (response) return response;
    if (response.errors) router.push(Routes.LeadGenGeneralError);
  }

  async function putPersonalDataLeadGen(smsOption = false) {
    const { put } = await useAxiosLeadGen();
    const url = `/v1/personal-composite-ms/applicant/personal-data`;

    const payload = {
      smsOptin: smsOption,
    };

    const response = await put(url, payload, { context: 'lead-gen' });
    if (response) return response;
  }

  const getIframeLeadGen = async () => {
    const { post } = await useAxiosLeadGen();

    const url = `/v1/card-composite-ms/card/iframe-url`;

    const response = await post(
      url,
      {
        redirectUrl:
          'https://web.dev.c.pfcld.com/profile/digital-wallet/add-debit-card',
      },
      { context: 'lead-gen' }
    );
    if (response) {
      return response;
    }
  };

  const postIframeLeadGen = async (payload: any) => {
    const { post } = await useAxiosLeadGen();

    const url = `/v1/card-composite-ms/card`;

    const response = await post(url, payload, { context: 'lead-gen' });

    if (response) {
      return response;
    }
  };

  const downloadUserDocumentLeadGen = async (id: number | string) => {
    const url = `/v1/document-composite-ms/document/content/${id}?as-attachment=true`;
    const { get } = await useAxiosLeadGen({ responseType: 'blob' });

    const response: any = await get(url, { context: 'lead-gen' });

    if (response) return response;
    if (response.errors) router.push(Routes.LeadGenGeneralError);
  };

  return {
    downloadLoanAgreementLeadGen,
    downloadUserDocumentLeadGen,
    getAvailableLoanOffersLeadGen,
    getDigitalWalletDataLeadGen,
    getDisclosureByStateLeadGen,
    getIframeLeadGen,
    getLeadGenData,
    getLoanAgreementsLeadGen,
    getLoanAprLeadGen,
    getLoanOffersFundingLeadGen,
    getLocationsByZipCodeLeadGen,
    getRepaymentOptionsLeadGen,
    getStoresByCoordinatesLeadGen,
    postIframeLeadGen,
    postEsignLeadGen,
    postUserConsentForDisclosuresLeadGen,
    putLoanOffersFundingLeadGen,
    putPersonalDataLeadGen,
    putRepaymentOptionLeadGen,
    putSelectProductLeadGen,
  };
};
