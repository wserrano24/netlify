import { Disclosure, DisclosureType } from '@/types/disclosure';
import useCompositeLeadGen from '@/composables/lead-gen/useCompositeLeadGen';
import useComposite from './useComposite';
import { useSessionStorage } from './useSessionStorage';
import { ref } from 'vue';
import { useState } from './useState';

export const useDisclosure = () => {
  const { getDisclosureByState, getPersonalInfo } = useComposite();
  const { getDisclosureByStateLeadGen } = useCompositeLeadGen();
  const { getItem } = useSessionStorage();

  // Store to memoize the already fetched disclosures
  const disclosures = ref<any>({});

  const getDisclosures = async (
    type = DisclosureType.DEFAULT,
    isDisclosureForUser = false
  ) => {
    let stateCode;
    if (!getItem('lead-state')) {
      const { homeAddress } = await getPersonalInfo();
      stateCode = homeAddress?.stateCode;
    } else {
      stateCode = getItem('lead-state');
    }

    const key = `${stateCode}-${type}-${
      isDisclosureForUser ? 'user' : 'state'
    }`;

    if (disclosures?.value === null || undefined) {
      disclosures.value = {};
    }

    // If disclosure for it's corresponding key is not available, fetch and store

    let exist:boolean = false;
    try{
      exist = disclosures.value[key]? true:false
    }catch(error){
      console.error(error)
      exist =false;
    }
    if ( !exist) {
      
      // fetch & store disclosures corresponding to it's key
      disclosures.value[key] = await fetchDisclosures(
        stateCode,
        type,
        isDisclosureForUser
      );
    }
    return await disclosures.value[key];
  };

  const fetchDisclosures = async (
    stateCode: string,
    type = DisclosureType.DEFAULT,
    isDisclosureForUser = false
  ) => {
    const params = {} as { disclosureType: DisclosureType };
    if (type !== DisclosureType.DEFAULT) {
      params.disclosureType = type;
    }
    const disclosuresByState = !getItem('lead-state')
      ? await getDisclosureByState(stateCode, isDisclosureForUser, params)
      : await getDisclosureByStateLeadGen(stateCode, false);

    const disclosureList = disclosuresByState?.data?.map((disclosure) => ({
      id: disclosure?.disclosureCode,
      label: disclosure?.disclosure,
    }));
    return disclosureList || [];
  };

  const flush = () => {
    disclosures.value = null;
  };

  return {
    getDisclosures,
    flush,
  };
};
