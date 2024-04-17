import { RouteName } from '@/constants/income-routes';

/**
 * @function getIncomeRoutesCurrentPathname - Will check whether current path is re-apply or manage-employment from route object.
 * @return  {String} - re-apply or mange-employment
 */

export const getIncomeRoutesCurrentPathname = (currentPath: string): string => {
  if (!currentPath) return '';

  const currentPathname = Object.keys(RouteName).find((a) =>
    currentPath.includes(RouteName[a])
  );

  return RouteName[currentPathname] || '';
};
