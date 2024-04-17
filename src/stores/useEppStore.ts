import { defineStore } from 'pinia';

interface State {
  balance?: string | number;
  paymentDueDate?: string;
  noOfPayments: string | number;
}

const state = (): State => ({
  balance: null,
  paymentDueDate: null,
  noOfPayments: null,
});

const actions = {
  setBalance(balance: string | number) {
    this.balance = `${balance}`;
  },
  setPaymentDueDate(date: string) {
    this.paymentDueDate = date;
  },
  setNoOfPayments(number: string | number) {
    this.noOfPayments = `${number}`;
  },
};

const getters = {
  getBalance: (state: State) => state.balance,
  getPaymentDueDate: (state: State) => state.paymentDueDate,
  getNoOfPayments: (state: State) => state.noOfPayments,
};

export default defineStore('useEppStore', {
  state,
  actions,
  getters,
});
