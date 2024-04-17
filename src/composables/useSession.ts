import { AccessToken, IDToken, Tokens, UserClaims,OktaAuth } from '@okta/okta-auth-js';
import { Routes } from '@/constants/pages';
import { scopes } from '@/constants/okta';
import { useCacheReset } from '@/composables/useCacheReset';
import { useSessionStorage } from './useSessionStorage';
import { useDomainVariables } from './useDomainVariables';
import { useError } from './useError';
import { ref } from 'vue';
import { useUserData } from './useUserData';
import { useCookie } from '@/utils/cookie';

export enum OktaFlows {
  Zipcode = 'zipcode',
  ChangePassword = 'ForgotPassword',
}

export const useAuthClient = () => {
  const { getItem } = useSessionStorage();

  const env = useDomainVariables();
  
  const REDIRECT_URI = getItem('LEAD_GEN_JWT') ? `${env.variables.value.OKTA_ORIGIN_LEAD_GEN}/login/callback` : `${env.variables.value.OKTA_ORIGIN}/login/callback`;

  const authClient = new OktaAuth({
    issuer: env.variables.value.OKTA_ISSUER,
    clientId: env.variables.value.OKTA_CLIENT_ID,
    redirectUri: REDIRECT_URI,
    scopes,
    cookies: {
      secure: true,
    },
    services: {
      syncStorage: true,
      autoRenew: true,
    },
  });

  const instantiateClient = (token: Tokens): void => {
    authClient.handleLoginRedirect(token);
    authClient.start();
  };

  return {
    authClient,
    instantiateClient,
  };
};

export const useJWT = () => {
  const { authClient } = useAuthClient();

  const getToken = async (): Promise<string> => {
    const tokenManager = authClient.tokenManager;
    const accessToken = await tokenManager.get('accessToken');

    return accessToken?.accessToken;
  };

  const refreshToken = (callback?: unknown): void => {
    authClient.tokenManager
      .renew('accessToken')
      .then(() => {
        if (typeof callback === 'function') {
          callback();
        }
      })
      .catch((error) => {
        const { handleError } = useError();

        handleError(error, 'applicant');
      });
  };

  const refreshTokenSpike = async (
    callback?: unknown,
    tokens?: Tokens
  ): Promise<void> => {
    const idToken: IDToken = tokens?.idToken || (await authClient.tokenManager.get('idToken'));

    const accessToken: AccessToken = tokens?.accessToken || (await authClient.tokenManager.get('accessToken'));

    const env = useDomainVariables();
    const authorizeUrl = `${env.variables.value.OKTA_ISSUER}/v1/authorize`;
    const claims: UserClaims = await authClient.token.getUserInfo(
      accessToken,
      idToken
    );

    const renewObj = {
      accessToken,
      claims,
      scopes,
      authorizeUrl,
      issuer: env.variables.value.OKTA_ISSUER,
      clientId: env.variables.value.OKTA_CLIENT_ID,
    };

    authClient.token
      .renew(renewObj)
      .then(async (newTokens) => {
        const token: Tokens = {
          accessToken: {
            accessToken: newTokens?.accessToken,
            claims,
            expiresAt: newTokens?.expiresAt,
            tokenType: 'Bearer',
            scopes,
            authorizeUrl,
            userinfoUrl: `${env.variables.value.OKTA_ISSUER}/v1/userinfo`,
          },
          idToken,
        };

        authClient.tokenManager.setTokens(token);

        if (typeof callback === 'function') {
          callback();
        }
      })
      .catch((error) => {
        console.log('authClient.token.renew error: ', error);

        const { handleError } = useError();

        handleError(error, 'applicant');
      });
  };

  return {
    getToken,
    refreshToken,
    refreshTokenSpike,
  };
};

export const useOkta = () => {
  const viewContext = ref<any>('');
  const signinFlowContext = ref<any>('');

  const updateViewContext = (context: string): void => {
    viewContext.value = context;
  };

  const updateSigninFlowContext = (context: string): void => {
    signinFlowContext.value = context;
  };

  return {
    signinFlowContext,
    updateSigninFlowContext,
    updateViewContext,
    viewContext,
  };
};

export const useSession = () => {
  
  const { authClient } = useAuthClient();

  const { value: isLoggedInCookie, set: isLoggedIn, delete: deleteCookie } = useCookie('isUserLoggedIn');

  const logIn = (): void => {
    isLoggedIn(true);
  };

  const logOut = async (redirectUrl = Routes.Login): Promise<void> => {
    const { deleteUser } = useUserData();
    const { clearItem } = useSessionStorage();
    const env = useDomainVariables();

    try {
      deleteUser();
      isLoggedIn(false);
      await authClient.revokeAccessToken();
      authClient.tokenManager.clear();
      authClient.closeSession();
      localStorage.removeItem('okta-cache-storage');
      clearItem();
      useCacheReset();
      
      await authClient.signOut({
        postLogoutRedirectUri: `${redirectUrl}`,
      });

    } catch (error) {
      const { handleError } = useError();

      handleError(error, 'okta');
    }
  };

  return {
    isLoggedIn: isLoggedInCookie,
    logIn,
    logOut,
  };
};
