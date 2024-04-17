import { Routes } from '@/constants/pages';
import { useRouter } from 'vue-router';
import useGetApplicationProccess from './useGetApplicationProccess';

export default () => {

  const applicationData = { page: '' };
  const router = useRouter();
  const currentRoute = router.currentRoute.value.path;
  let saveAndExitData = {};

  const getDefaultData = async (savedDataService?: () => void) => {
    const userData = savedDataService ? await savedDataService() : {};
    const {getApplicationData} = useGetApplicationProccess()

    const { lastApplicationPage } = await getApplicationData();

    const page = Routes[lastApplicationPage?.page] || '';

    const isSaveAndExit = lastApplicationPage?.isSaveAndExit || false;

    // It validates if save and exit information was saved for this page.
    if (page === currentRoute) {
      saveAndExitData = lastApplicationPage?.data || {};

      applicationData.page = page;
    }

    return {
      isSaveAndExit,
      saveAndExitData,
      userData,
    };
  };

  return {
    getDefaultData,
  };
};
