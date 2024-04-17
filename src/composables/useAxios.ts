import axios, { AxiosRequestConfig, ResponseType } from 'axios';
import { AnyObject } from 'yup/lib/types';
import { Context, useError } from './useError';
import { useJWT } from './useSession';
import { useDomainVariables } from './useDomainVariables';

interface UseAxios {
  useAuth?: boolean;
  responseType?: ResponseType;
}

interface RequestSettings {
  context?: Context;
}

const toErrorObject = (error: Error): { status: number } => {
  return JSON.parse(JSON.stringify(error));
};

export default async (options?: UseAxios) => {
  const { useAuth = true, responseType = 'json' } = options || {};
  const session = useJWT();
  const token = await session.getToken();

  const env = useDomainVariables();

  const instance = axios.create({
    baseURL: env.variables.value.PURPOSE_ENDPOINT,
    headers: token && useAuth && { Authorization: `Bearer ${token}` },
    withCredentials: true,
    responseType,
  });

  const get = async (
    url: string,
    options?: RequestSettings,
    params?: AnyObject
  ): Promise<unknown> =>
    instance
      .get(url, { params })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        const { handleError } = useError();

        if (error.response) {
          return handleError(error.response, options?.context);
        }

        handleError(toErrorObject(error), options?.context);
      });

  const post = async (
    url: string,
    payload?: unknown,
    options?: RequestSettings,
    requestConfig: AxiosRequestConfig = {}
  ): Promise<unknown> =>
    instance
      .post(url, payload, requestConfig)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        
        const { handleError } = useError();

        if (error.response) {
          return handleError(error.response, options?.context);
        }

        return handleError(toErrorObject(error), options?.context);
      });

  const put = async (
    url: string,
    payload: unknown,
    options?: RequestSettings
  ): Promise<unknown> =>
    instance
      .put(url, payload)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        const { handleError } = useError();

        if (error.response) {
          return handleError(error.response, options?.context, payload);
        }

        handleError(toErrorObject(error), options?.context);
      });

  const deleteItem = async (
    url: string,
    options?: RequestSettings
  ): Promise<unknown> =>
    instance
      .delete(url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        const { handleError } = useError();

        if (error.response) {
          return handleError(error.response, options?.context);
        }

        handleError(toErrorObject(error), options?.context);
      });

  return {
    get,
    post,
    put,
    deleteItem,
  };
};
