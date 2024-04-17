export const throttleFunc = (func, interval) => {
  let shouldFire = true;
  return function () {
    if (shouldFire) {
      func();
      shouldFire = false;
      setTimeout(() => {
        shouldFire = true;
      }, interval);
    }
  };
};
