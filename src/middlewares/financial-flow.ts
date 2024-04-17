import { useApplicationProcess } from '@/composables/useApplicationProcess';
import { usePage } from '@/composables/usePage';
import { Routes } from '@/constants/pages';
import { useRoute, useRouter } from 'vue-router';

export const FinancialFlowGuards = async (from, to) => {
    const { getPageName, getQueryParams } = usePage();
    const isUserComingFromExitScreen = to.path === Routes.ExitAplication;
    const isUserComingFromDashboard = to.path === Routes.Dashboard;
    const { updateApplicationProcess } = useApplicationProcess();
    const page = getPageName(from.path);

    if (isUserComingFromExitScreen || isUserComingFromDashboard) {
      const router = useRouter();

      return router.push(Routes.FinancialSummary);
    }

    const route = useRoute();
    const query = route?.query || {};
    const queryStrings = getQueryParams(query);

    updateApplicationProcess({ page, query: queryStrings, data: {} });
  
}