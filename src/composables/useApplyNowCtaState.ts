import { Routes } from '@/constants/pages';
import { useState } from './useState';
import usePersonalInfo from './usePersonalInfo';
import useComposite from './useComposite';

export const useApplyNowCtaState = () => {
  const { getApplicationData } = useComposite();
  const {getPersonalInfo} = usePersonalInfo()

  const isStartYourApplication = useState<boolean>(
    'isStartYourApplication',
    () => false
  );

  const getApplyNowCtaState = async () => {
    const { lastApplicationPage } = await getApplicationData();
    const { firstName } = (await getPersonalInfo()) || {};

    const page = lastApplicationPage?.page || '';
    const isSaveAndExit = lastApplicationPage?.isSaveAndExit || false;
    const baseUrl = Routes[page] || Routes.PersonalInformation;

    const isStartApplication =
      baseUrl === Routes.PersonalInformation && !isSaveAndExit && !firstName;

    isStartYourApplication.value = isStartApplication;

    return {
      isStartYourApplication: isStartYourApplication.value,
    };
  };
  return {
    getApplyNowCtaState,
  };
};
