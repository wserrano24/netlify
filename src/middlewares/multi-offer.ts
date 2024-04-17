import { useApplicationProcess } from '@/composables/useApplicationProcess';
import { usePage } from '@/composables/usePage';
import { useSessionStorage } from '@/composables/useSessionStorage';
import { Routes } from '@/constants/pages';
import { useProductStore } from '@/stores/useProductStore';
import { useRoute, useRouter } from 'vue-router';

export const MultiOfferGuards = async (from, to) => {
    const { updateApplicationProcess } = useApplicationProcess();
    const { getPageName, getQueryParams } = usePage();
    const hasReviewedDisclosures = useProductStore();
    const { getItem } = useSessionStorage();
    const router = useRouter();
    const route = useRoute();

    const query = route?.query || {};
    const queryStrings = getQueryParams(query);

    if (from.fullPath === Routes.LoanOriginationOffers) {
      const page = getPageName(Routes.LoanOriginationOffers);

      await updateApplicationProcess({ page, query: queryStrings, data: {} });

      return router.push(Routes.Dashboard);
    }

    if ((from.fullPath === Routes.Dashboard &&
        to.fullPath === Routes.FinancialSuccessMessage &&
        !hasReviewedDisclosures &&
        getItem('hasReviewedDisclosures') === false) ||
      getItem('hasReviewedDisclosures') === null
    ) {
      return router.push(Routes.FinancialSummary);
    }
}