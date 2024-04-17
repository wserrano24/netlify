import useAxios from "./useAxios";

export default ()=>{


    async function getFinancialBankName(routingNumber: string) {
        const { get } = await useAxios();
    
        const url ='/v1/bank-composite-ms/applicant/financial-data/routing-number/';
    
        const response:any = await get(`${url}${routingNumber}`, {
          context: 'financial',
        });
    
        return response?.bankName || '';
      }
    
      const getValidIncomeDates = async (incomeId: string) => {
        const url = `/v1/income-composite-ms/applicant/financial-data/income/${incomeId}/valid-date`;
        const { get } = await useAxios();
    
        const response = await get(url);
        if (response) {
          return response;
        }
      };

      return {
        getFinancialBankName,
        getValidIncomeDates
      }

}