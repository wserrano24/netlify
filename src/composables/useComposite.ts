import { ApplicationSummary, LoanTrackerResponse, ProductSummary } from "@/constants/product";
import useAxios from "./useAxios";
import { Application, useApplicationProcess } from "./useApplicationProcess";
import { isJsonString } from "@/utils/isJsonString";
import { useDomainVariables } from "./useDomainVariables";
import { Contentful } from "@/types/contentful";

export default () => {
    async function getAvailLoanData() {
        const { get } = await useAxios();

        const url = '/v1/avail-loan-composite-ms/avail-loan';

        const response = await get(url);

        if (response) {
            const data = response.data || {};
            return {
                data,
            };
        }
    }
    async function getProductsPolling(appId) {
        const { get } = await useAxios();

        const url = `/v1/product-composite-ms/product?qfund-app-id=${appId}`;
        const response = await get(url);

        if (response) {
            return response.data;
        }
    }
    async function getActiveProducts() {
        const { get } = await useAxios();

        const url = '/v1/product-composite-ms/product';
        const response = (await get(url)) as {
            data: {
                products: Array<ProductSummary>;
                applications: Array<ApplicationSummary>;
            };
        };

        if (response) {
            return response.data;
        }
    }
    async function getApplicationData(latestOnly = true) {
        const { get } = await useAxios();
        const { setApplicationState } = useApplicationProcess();
    
        const url = `/v1/application-composite-ms/application/?latest=${latestOnly}`;
        let applicationList = [];
        let applicationId = '';
        let state = '';
        let lastApplicationPage: Application = {
          page: '',
          query: '',
          data: {},
          isSaveAndExit: false,
        };
    
        const response = await get(url);
    
        if (response) {
          applicationList = response?.data?.applicationList || [];
          applicationId = applicationList?.[0]?.applicationId || '';
    
          const applicationPage: string =
            applicationList?.[0]?.lastApplicationPage || '';
          state = applicationList?.[0]?.state || '';
    
          if (applicationPage !== '' && isJsonString(applicationPage)) {
            lastApplicationPage = JSON.parse(applicationPage);
          }
        }
    
        setApplicationState({ applicationId });
        return {
          applicationId,
          applicationList,
          lastApplicationPage,
          state,
        };
      }
      async function getContentful(url: string) {
        const env = useDomainVariables();
        const { get } = await useAxios({ useAuth: false });
        const endpointUrl = env.variables.value.CONTENTFUL_ENDPOINT + url;
    
        const response: Partial<Contentful> = await get(endpointUrl, {
          context: 'contentful',
        });
    
        if (response) {
          return response;
        }
      }

  async function getLoanTracker(productId: string) {
    const { get } = await useAxios();

    const url = `/v1/loan-tracker-composite-ms/loan-tracker/${productId}`;
    const response = (await get(url)) as {
      data: LoanTrackerResponse;
    };

    if (response) {
      return response?.data;
    }
  }
    return {
        getAvailLoanData,
        getProductsPolling,
        getActiveProducts,
        getApplicationData,
        getContentful,
        getLoanTracker
    }
}