import { Routes } from '@/constants/pages';
import { useRouter } from 'vue-router';
export default () => {
  const router = useRouter();

  /**
   * Function to return the previous route if it exist else return fallback route
   * @param {Routes} fallbackRoute the fallback route in case the back route does not exist
   * @returns {string} the previous route
   */
  const getPreviousRoute = (fallbackRoute: Routes = Routes.Dashboard): string =>
    (router?.options?.history?.state?.back as string) || fallbackRoute;

  /**
   * Function to redirect to the previous route if it exist
   * @param {Routes} fallbackRoute the fallback route in case the back route does not exist
   * @returns {undefined | void}
   */
  const redirectToPreviousRoute = (
    fallbackRoute: Routes = Routes.Dashboard
  ) => {
    router?.options?.history?.state?.back
      ? router.back()
      : router.push(fallbackRoute);
  };

  return {
    getPreviousRoute,
    redirectToPreviousRoute,
  };
};
