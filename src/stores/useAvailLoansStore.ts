import { defineStore } from 'pinia'


type AvailableLoan = {
  productCode: string;
  productName: string;
  productType: string;
  minLoanAmount: number;
  maxLoanAmount: number;
  eligibilityStatus: string;
  ineligibleReason: string;
};

type AvailLoan = {
  availLoanList: [AvailableLoan];
  coolOffDate?: string;
  firstName: string;
  isCoolOff?: boolean;
  lastName: string;
  showCard: string;
};

type AvailLoanData = {
  data: AvailLoan|undefined;
  errors?: string;
  meta?: string;
};

type DataVailLoanData={
    availLoan:AvailLoanData|undefined;
}

export const useAvailLoansStore=defineStore('availLoansStore',{
    state: (): DataVailLoanData => ({
        availLoan:undefined,
}),
getters:{
	getAvailLoan():AvailLoanData|undefined{
		return this.availLoan;
	}
},
actions:{
	setAvailLoanData(value: AvailLoanData){
		this.availLoan = value;
	}
},
});
