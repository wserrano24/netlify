import { defineStore } from 'pinia';

interface State {
  userState: string;
  userZipcode: string;
  userPurposeId: string;
}

const state = (): State => ({
  userState: null,
  userZipcode: null,
  userPurposeId: null,
});

const actions = {
  setUserState(string) {
    this.userState = string;
  },
  setUserZipcode(string) {
    this.userZipcode = string;
  },
  setUserPurposeId(string) {
    this.userPurposeId = string;
  },
};

const getters = {
  getUserState: (state: State) => state.userState,
  getUserZipcode: (state: State) => state.userZipcode,
  getUserPurposeId: (state: State) => state.userPurposeId,
};

export default defineStore('useUserStore', {
  state,
  actions,
  getters,
});
