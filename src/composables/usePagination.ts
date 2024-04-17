import { computed, reactive } from "vue";

type PaginationProps = {
  state: {
    totalPages: number;
    currentPage: number;
    showMore: boolean;
  };
};

// TODO: May need refactoring once the services are integrated
/**
 * Composable to handle pagination property
 * @param {number} listLength the length of the list
 * @param {number} perPageEntries the number of entries to be shown on each page
 */
export const usePagination = (listLength, perPageEntries = 5) => {
  const state: PaginationProps['state'] = reactive({
    currentPage: 1,
    totalPages: computed(() => Math.ceil(listLength / perPageEntries)),
    showMore: computed(() => state?.currentPage < state?.totalPages),
  });

  const handlePageChange = () => {
    state.currentPage += 1;
  };

  return {
    state,
    handlePageChange,
  };
};
