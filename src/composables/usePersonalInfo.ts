import { useRouter } from "vue-router";
import useAxios from "./useAxios";
import { Routes } from "@/constants/pages";

export default () =>{

  const router = useRouter();

  const getPersonalInfo = async () => {

    const { get } = await useAxios();
    const url = `/v1/personal-composite-ms/applicant/personal-data`;
    const response: any = await get(url);
    if (response) {
      const { homeAddress, identity, personal } = response || {};
      const address1 = [
        homeAddress?.address1,
        homeAddress?.address2,
        homeAddress?.city,
      ]
        .filter((v) => v)
        .join(", ");

      const address2 = [homeAddress?.stateCode, homeAddress?.zipCode]
        .filter((v) => v)
        .join(" ");

      const address = (address1 ? `${address1}, ` : "") + address2;
      const auxA: any = {
        homeAddress: homeAddress ? homeAddress : undefined,
        personal: personal ? personal : undefined,
        address: address ? address : undefined,
        currentPhone: personal?.currentPhone
          ? personal?.currentPhone
          : undefined,
        dateOfBirth: personal?.dateOfBirth ? personal?.dateOfBirth : undefined,
        email: identity?.email ? identity?.email : undefined,
        firstName: personal?.firstName || "",
        lastName: personal?.lastName || "",
        ssn: personal?.ssn,
        smsOptin: personal?.smsOptin,
      };

      return auxA;
    }
  }


  /**
 * 
 * @param to 
 * Ejemploexport
 * @returns 
 */
const putPersonalData = async (to: Routes | false) => {
    const { put } = await useAxios();
    const url = '/v1/personal-composite-ms/applicant/personal-data';

    return (payload) => {
      return put(url, payload).then((response) => {
        if (response && !(response instanceof Error) && to) {
          return router.push(to);
        }

        return response;
      });
    };
  }


  async function fetchUserActions() {
    const { get } = await useAxios();
    const url = '/v1/document-composite-ms/document/user/actions';

    const response:any = await get(url);

    if (response) {
      return response.data;
    }
  }

  async function getIncomeInfo() {
    const { get } = await useAxios();
    const url = '/v1/income-composite-ms/applicant/financial-data/income';

    const response:any = await get(url, { context: 'financial' });
    let incomeSources:any;
    let errors:any;

    if (response) {
      incomeSources = response?.data || {};
      errors = response?.errors || {};
    }
    return {
      incomeSources,
      errors,
    };
  }

  async function putIncomeInfo(data, id) {
    const { put } = await useAxios();

    const url = `/v1/income-composite-ms/applicant/financial-data/income/${id}`;

    const response = await put(url, data);

    if (response) {
      return response;
    }
  }

  async function postIncomeInfo(data) {
    const { post } = await useAxios();

    const url = `/v1/income-composite-ms/applicant/financial-data/income`;

    const newId = await post(url, data).then((res) => {
      return res?.data?.incomeId;
    });

    return newId;
  }

  return{
      getPersonalInfo,
      putPersonalData,
      fetchUserActions,
      getIncomeInfo,
      putIncomeInfo,
      postIncomeInfo
  }
}