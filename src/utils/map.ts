import { useError } from "@/composables/useError";

export const getAddressPartFunction =
  (addressObject:any) =>
  (type: string, key: 'long_name' | 'short_name' = 'long_name') => {
    const component = addressObject?.address_components?.find((part:any) =>
      part?.types?.includes(type)
    );

    if (component) {
      return component?.[key];
    }
    return null;
  };

export const getFullAddressObject = (addressObject:any) => {
  try {
    const getAddressPart = getAddressPartFunction(addressObject);
    const city =
      getAddressPart('locality') ||
      getAddressPart('sublocality_level_1') ||
      getAddressPart('sublocality');

    return {
      City: city,
      PostalCode: getAddressPart('postal_code'),
      County: getAddressPart('administrative_area_level_2'),
      State: getAddressPart('administrative_area_level_1'),
      StateCode: getAddressPart('administrative_area_level_1', 'short_name'),
      Country: getAddressPart('country'),
      CountryCode: getAddressPart('country', 'short_name'),
      StreetName: getAddressPart('route'),
      StreetNameShort: getAddressPart('route', 'short_name'),
      StreetNumber: getAddressPart('street_number'),
      Neighborhood: getAddressPart('neighborhood'),
      PostalCodeSuffix: getAddressPart('postal_code_suffix'),
    };
  } catch (error:any) {
    const { handleError } = useError();

    handleError(error, 'gmaps');
  }
};

export const getCurrentLocation = (callback:any) => {
  const handleSuccess = (position:any) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    callback({
      latitude,
      longitude,
    });
  };

  const handleEerror = () => {
    callback({
      error: 'Unable to retrieve your location',
    });
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handleSuccess, handleEerror);
  } else {
    callback({
      error: 'Geolocation is not supported by your browser',
    });
  }
};
