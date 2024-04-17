import { ApplicationSummary, ProductSummary } from "@/constants/product";
import useAxios from "./useAxios";
import { Application, useApplicationProcess } from "./useApplicationProcess";
import { isJsonString } from "@/utils/isJsonString";
import { useRouter } from "vue-router";

export default () =>{


    async function postApplication(payload: any) {
        const { post } = await useAxios();
        const url = "/v1/application-composite-ms/application/";
        const data = {
          lastApplicationPage: payload.lastApplicationPage,
          appSource: "PWA",
        };
        const response = await post(url, data);
    
        if (response) {
          return response;
        }
      }

      async function putApplication(applicationId: string, payload: any) {
        const { put } = await useAxios();
        const url = `/v1/application-composite-ms/application/${applicationId}`;
        const response = await put(url, payload);
    
        if (response) {
          return response;
        }
      }

      async function getActiveProducts() {
        const { get } = await useAxios();
    
        const url = "/v1/product-composite-ms/product";
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
        let applicationId = "";
        let state = "";
        let lastApplicationPage: Application | any = {
          page: "",
          query: "",
          data: {},
          isSaveAndExit: false,
        };
    
        const response: any = await get(url);
    
        if (response) {
          applicationList = response?.data?.applicationList || [];
          applicationId = applicationList?.[0]?.applicationId || "";
    
          const applicationPage: string =
            applicationList?.[0]?.lastApplicationPage || "";
          state = applicationList?.[0]?.state || "";
    
          if (applicationPage !== "" && isJsonString(applicationPage)) {
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



      return{
        getApplicationData,
        postApplication,
        putApplication,
        getActiveProducts
      }

}