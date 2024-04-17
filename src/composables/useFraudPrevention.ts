export interface ClientFingerPrint {
  'DATA-X'?: string;
  'EXPERIAN-PAYLOAD'?: string;
  HDM?: string;
  'CUSTOM-COOKIE-HEADER'?: string;
}

const useFraudPrevention = <T>(data?: T): ClientFingerPrint => {
  const validationData: ClientFingerPrint = {};

    if (window) {
      if (window?.adx) {
        window?.adx.initiate(null);
        validationData.HDM = window?.adx.validate('user_prefs2');
        validationData['EXPERIAN-PAYLOAD'] =
          window?.adx.validate('experianPayload');
      } else {
        console.error('adx is not defined, ensure the prefs.js script loaded');
      }

      if (window?.pixel) {
        validationData['DATA-X'] = (<HTMLInputElement>(
          document.getElementById('datax_pixel')
        )).value;
      } else {
        console.error(
          'pixel is not defined, ensure the pixel.js script loaded and the snare.js scripts are included in the project'
        );
      }
    }
    validationData['CUSTOM-COOKIE-HEADER'] = document.cookie;
    if (data) {
      return Object.assign(data, validationData);
    }
    return validationData;
  
};

export default useFraudPrevention;
