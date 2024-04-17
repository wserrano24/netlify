import { useDomainVariables } from "./useDomainVariables";

const useGTM = () => {
  const env = useDomainVariables();

  const googleTagManager = () => {
    window['dataLayer'] = window['dataLayer'] || [];
    window['dataLayer'].push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js',
    });

    const firstScriptTagOnPage = document.getElementsByTagName('script')[0];
    const gtmScript = document.createElement('script');

    gtmScript.async = true;
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${env.variables.value.GTM_ID}&l=dataLayer`;

    firstScriptTagOnPage.parentNode.insertBefore(
      gtmScript,
      firstScriptTagOnPage
    );
  };

  return { googleTagManager };
};

export default useGTM;
