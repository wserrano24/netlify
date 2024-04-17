import LogRocket from 'logrocket';
import LogrocketFuzzySanitizer from 'logrocket-fuzzy-search-sanitizer';
import { useDomainVariables } from './useDomainVariables';
//const { getPersonalInfo } = useComposite();

import usePersonalInfo from './usePersonalInfo';
const {getPersonalInfo} = usePersonalInfo()
const privateFieldNames = [
  'firstName',
  'lastName',
  'currentPhone',
  'driversLicense',
  'address1',
  'address2',
  'address3',
  'password',
  'ssn',
  'dateOfBirth',
  'DOB',
  'accountNumber',
  'routingNumber',
  'accountId',
  'bankName',
  'routingNumber',
  'checkingAccNumber',
  'employerName',
  'payPerCheck',
  'grossPayPerCheck',
  'cardExpiry',
  'cardBin',
];
const { requestSanitizer, responseSanitizer } =
  LogrocketFuzzySanitizer.setup(privateFieldNames);

const useLogRocket = () => {
  const { value: env } = useDomainVariables().variables;
  const logRocketInit = () => {
    LogRocket.init(env['LOG_ROCKET_ID'], {
      release: env['APP_VERSION'],
      rootHostname: env['ROOT_HOSTNAME'],
      shouldDebugLog: JSON.parse(env['LOG_ROCKET_DEBUG'] || 'false'),
      network: {
        requestSanitizer: requestSanitizer,
        responseSanitizer: responseSanitizer,
      },
      mergeIframes: true,
      childDomains: ['*']
    });
  };

  const logRocketIdentify = async () => {
    const { homeAddress, firstName, lastName, email } = await getPersonalInfo();
    LogRocket.identify(homeAddress.purposeId, {
      name: `${firstName} ${lastName}`,
      email: email,
      state: homeAddress.stateCode,
    });
  };

  return {
    logRocketInit,
    logRocketIdentify,
  };
};

export default useLogRocket;
