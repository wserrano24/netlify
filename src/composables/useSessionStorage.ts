export const useSessionStorage = () => {
  
  const setItem = <T>(key: string, value: T): void => {
    sessionStorage.setItem(key, JSON.stringify(value));
  };
  const getItem = <T>(key: string): T => {
    if (key !== undefined) {
      return JSON.parse(sessionStorage.getItem(key));
    }
    return null;
  };
  const removeItem = (key: string): void => {
    sessionStorage.removeItem(key);
  };
  const clearItem = (): void => {
    sessionStorage.clear();
  };

  return {
    setItem,
    getItem,
    removeItem,
    clearItem,
  };

};