import axios from 'axios';
import { useDomainVariables } from './useDomainVariables';

export const useSwagger = () => {
  function getServer<T>(url: string): Promise<T> {
    const env = useDomainVariables();
    const response = axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: env.variables.value.SWAGGER_KEY,
        },
      })
      .then(({ data }) => {
        return data;
      });
    return response;
  }
  const postServer = <T, K>(url: string, request?: T): Promise<K> => {
    const env = useDomainVariables();
    const response = axios
      .post(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: env.variables.value.SWAGGER_KEY,
          requestBody: request,
        },
      })
      .then(({ data }) => {
        return data.data;
      });
    return response;
  };

  return {
    getServer,
    postServer,
  };
};
