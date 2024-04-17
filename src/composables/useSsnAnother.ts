import useAxios from "./useAxios";
import  usePersonalInfo  from "./usePersonalInfo";

export default () => {

    const postFindAndMergeAccounts = async (payload: any) => {
        const { post } = await useAxios();
    
        const url = "/v1/personal-composite-ms/applicant/personal-data/ssn/find-and-merge-accounts";
    
        const response = await post(url, payload, { context: "in-store" });
    
        if (response) {
          return response;
        }
      };
    
    
      const postPersonalSsnMergeAccounts = async () => {
        const { post } = await useAxios();
        const url =
          "/v1/personal-composite-ms/applicant/personal-data/ssn/merge-accounts";
        const {getPersonalInfo} = usePersonalInfo()
        const { dateOfBirth, ssn } = await getPersonalInfo();
        const response = await post(url, { dateOfBirth, ssn });
    
        return response;
      };


      return{
        postFindAndMergeAccounts,
        postPersonalSsnMergeAccounts
      }

}