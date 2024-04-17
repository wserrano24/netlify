export const useCacheReset = () => {
  const event = new CustomEvent('reset-cache');
  window.dispatchEvent(event);
}