import { Routes } from '@/constants/pages';
import { useRoute } from 'vue-router';

const route = useRoute();

export const usePage = () => {
  const getPageName = (page: string): string =>
    Object.entries(Routes).filter((v) => v?.[1] === page)?.[0]?.[0] || '';

  const getQueryParams = (query: Record<string, string | string[] | any>): string => {
    return Object.keys(query)
      .map((v) => `${v}=${query[v]}`)
      .join('&');
  };

  // TODO: Add tests when auto-import issue is resolved
  const getQueryString = (query = '') => {
    return route?.query?.[query] || '';
  };

  return {
    getPageName,
    getQueryParams,
    getQueryString,
  };
};
