import { defineStore } from 'pinia';
interface State {
  split: 'HOLIDAY' | 'MAINTENANCE' | 'SLOW' | 'PLANNED_OUTAGE' | null;
  splitPayload: Record<string, unknown>;
}

const state = (): State => ({
  split: null,
  splitPayload: null,
});

const actions = {
  setSplit(string) {
    this.split = string;
  },
  clearSplit() {
    this.split = null;
  },
  setSplitPayload(object) {
    this.splitPayload = object;
  },
  clearSplitPayload() {
    this.splitPayload = null;
  },
};

const getters = {
  getSplit: (state: State) => state.split,
  getSplitPayload: (state: State) => state.splitPayload,
};

export default defineStore('useSplitStore', {
  state,
  actions,
  getters,
});
