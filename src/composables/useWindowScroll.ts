/**
 * NOTE: This is a client only composable
 */
type ScrollBehavior = 'smooth' | 'auto';
export const useWindowScroll = () => {
  /**
   * Wrapper function for window.ScrollBy function to call the function only if the feature is rendered on client and not on server
   * @param {number} scrollToValue the value that needs to be scrolled
   * @param {ScrollBehavior} behavior the scroll behavior
   */
  const scrollBy = (
    scrollToValue: number,
    behavior: ScrollBehavior = 'smooth'
  ) =>
    window &&
    window.scrollBy({
      top: scrollToValue,
      behavior: behavior,
    });

  return { scrollBy };
};
