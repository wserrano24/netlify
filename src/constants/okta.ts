import { useOktaProperties } from "@/composables/useOktaProperties";

interface Ii18nProperties {
  en: { [key: string]: string };
}

export enum ViewContext {
  Login = 'primary-auth',
  Register = 'registration',
  MfaVerify = 'mfa-verify',
}

export const i18nProperties = (): Ii18nProperties => {
  const { properties } = useOktaProperties();

  return {
    en: {
      //Label
      forgotpassword: properties.value?.ForgotPassword,
      unlockaccount: properties?.value?.UnlockAccount,

      // Login
      'primaryauth.title': properties.value?.LoginTitle,
      'primaryauth.submit': properties.value?.LoginSubmit,
      'primaryauth.username.placeholder': properties.value?.LoginPlaceholder,
      'primaryauth.password.placeholder': properties.value?.LoginPassword,
      needhelp: properties.value?.LoginHelp,
      'registration.signup.label': properties.value?.LoginSignUpLabel,
      'registration.signup.text': properties.value?.LoginSignUpText,

      // Register
      'registration.form.title': properties.value?.Register,

      // Reset password
      'password.forgot.email.or.username.placeholder':
        properties.value?.ResetPasswordPlaceholder,
      'password.forgot.email.or.username.tooltip':
        properties.value?.ResetPasswordTooltip,

      // Unlock Account
      'account.unlock.email.or.username.placeholder':
        properties.value?.UnlockAccountPlaceholder,
      'account.unlock.email.or.username.tooltip': ' ',

      // General errors- for security no detailed error messages to be provided to user
      'errors.E0000004': properties.value?.GeneralErrorsE0000004,
      'errors.E0000047': properties.value?.GeneralErrorsE0000004,
      'error.auth.lockedOut': properties.value?.GeneralErrorsE0000004,

      // Field level errors
      'error.username.required': properties.value?.FieldLevelErrors,
    },
  };
};

export const scopes = [
  'openid',
  'email',
  'profile',
  'address',
  'phone',
  'self',
];
