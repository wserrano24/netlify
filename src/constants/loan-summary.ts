export enum LoanSummaryResponseKeys {
  Apr = 'apr',
  DisbursementDetails = 'disbursementDetails',
  DisbursementMethod = 'disbursementMethod',
  DrawAmount = 'drawAmount',
  EsignName = 'esignName',
  EstPaymentAmount = 'estPaymentAmt',
  FinanceCharge = 'financeCharge',
  LineOfCredit = 'lineOfCredit',
  FirstPaymentDate = 'firstPaymentDate',
  LoanAmount = 'loanAmount',
  NoOfInst = 'noOfInst',
  ProductId = 'productId',
  ProductType = 'productType',
  TotalRepaymentAmt = 'totalRepaymentAmt',
  Agreements = 'agreements',
}

export enum LoanTypes {
  Payday = 'PDL',
  Installment = 'ILP',
  LineOfCredit = 'LOC',
  Title = 'TLP',
}

export const ApiLoanTypes = (prodType: string) => {
  switch (prodType) {
    case 'ILP':
      return 'installment';
      break;
    case 'LOC':
      return 'loc';
      break;
    case 'TLP':
      return 'title';
      break;
    default:
      return 'payday';
  }
};

export enum DisbursementTypes {
  Bank = 'Bank Transfer',
  CashAtStore = 'Cash At Store',
  Debit = 'Debit Card',
}

export enum DisbursementMethods {
  bankAccount = 'Bank Transfer',
  pickUpInStore = 'Cash At Store',
  debitCard = 'DebitCard Instant Fund',
}
