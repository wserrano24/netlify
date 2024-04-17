import {
  FooterLabelRoutes,
  FooterLabels,
  RouteLabels,
  Routes,
} from '@/constants/pages';

export default () => {
  /**
   * Function to return the route associated with the cta label
   * @param {string} label the cta label
   * @returns {string} the route associated with the CTA label
   */
  const mapCtaRoutes = (label: string): string => {
    const route =
      Object.keys(RouteLabels).filter(
        (v) => RouteLabels[v] === label?.toString()?.toLowerCase()
      )?.[0] || 'Landing';

    return Routes[route];
  };

  /**
   * Function to return the route associated with the footer label
   * @param {string} label the footer label
   * @returns {string} the route associated with the footer label
   */
  const mapFooterRoutes = (label: string): string => {
    const route =
      Object.keys(FooterLabels).filter(
        (v) => FooterLabels[v] === label?.toString()?.toLowerCase()
      )?.[0] || 'Landing';

    return FooterLabelRoutes[route];
  };

  return { mapCtaRoutes, mapFooterRoutes };
};
