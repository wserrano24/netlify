import * as maskaPkg from 'maska';

import { Masks } from '@/constants/masks';

const { mask, tokens } = maskaPkg;

export const useMask = () => {
  /**
   * @param value
   * @param maskTo
   * @returns masked string
   */
  const getMaskedString = (value: string, maskTo: string | string[]) => {
    if (!value) return '';
    if (!maskTo) return value;
    return mask(value, maskTo, tokens, true);
  };

  /**
   * @param value
   * @param maskedFrom
   * @returns un-masked string
   */
  const getUnMaskedString = (value: string, maskedFrom: string | string[]) => {
    if (!value) return '';
    if (!maskedFrom) return value;
    return mask(value, maskedFrom, tokens, false);
  };

  /**
   * @param value - the masked phone number
   * @param maskedFrom Optional - Default is Masks.UsPhone
   * @returns un-masked phone number
   */
  const getUnMaskedPhoneNumber = (value: string, maskedFrom = Masks.UsPhone) =>
    getUnMaskedString(value, maskedFrom);

  return {
    getMaskedString,
    getUnMaskedString,
    getUnMaskedPhoneNumber,
  };
};
