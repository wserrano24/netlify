!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.OktaPluginA11y=e():t.OktaPluginA11y=e()}(self,(function(){return function(){"use strict";var t={};return function(){var e=t;function a(t){return function(t){if(Array.isArray(t))return r(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(!t)return;if("string"==typeof t)return r(t,e);var a=Object.prototype.toString.call(t).slice(8,-1);"Object"===a&&t.constructor&&(a=t.constructor.name);if("Map"===a||"Set"===a)return Array.from(t);if("Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return r(t,e)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function r(t,e){(null==e||e>t.length)&&(e=t.length);for(var a=0,r=new Array(e);a<e;a++)r[a]=t[a];return r}function i(t,e){var a=document.querySelectorAll(t)||[],r=Object.keys(e)||[];a.forEach((function(t){r.forEach((function(a){t.setAttribute(a,e[a])}))}))}function o(t){return t?t.replace(/[_ ]/g,"-").split("-").map((function(t){return t[0].toUpperCase()+t.substring(1)})).join(" "):""}Object.defineProperty(e,"__esModule",{value:!0}),e.init=void 0;var n=[{controller:"mfa-verify-passcode",formName:"challenge-authenticator",authenticatorKey:"phone_number",methodType:"sms"},{controller:"enroll-email",formName:"enroll-authenticator",authenticatorKey:"okta_email",methodType:"email"},{controller:"mfa-verify",formName:"challenge-poll",authenticatorKey:"okta_verify",methodType:"push"},{controller:"forgot-password",formName:"identify-recovery"}];function l(t){var e=t.controller,a=t.formName,r=t.authenticatorKey,i=t.methodType,n=[{tester:"primary-auth"===e&&"identify"===a,title:"Sign in"},{tester:"registration"===e,title:"Sign up"},{tester:"forgot-password"===e,title:"Reset password"},{tester:"select-authenticator-authenticate"===a,title:"Select authenticator"},{tester:"select-authenticator-enroll"===a,title:"Set up security authenticators"},{tester:"authenticator-verification-data"===a&&"sms"===i,title:"Verify with phone SMS"},{tester:"mfa-verify-passcode"===e&&"challenge-authenticator"===a&&"voice"===i,title:"Verify with phone voice call"},{tester:/^enroll-/.test(e)&&"enroll-authenticator"===a,title:"Set up ".concat(i," authenticator")},{tester:"enroll-poll"===a,title:"Set up ".concat(o(r))},{tester:/^mfa-verify-/.test(e)&&"challenge-authenticator"===a,title:"Verify using ".concat(i," authenticator")},{tester:"authenticator-verification-data"===a,title:"Verify using ".concat(i," authenticator")},{tester:"mfa-verify-webauthn"===e&&"challenge-authenticator"===a&&"webauthn"===i,title:"Verify using security key or biometric authenticator"},{tester:"mfa-verify"===e&&"challenge-authenticator"===a&&"totp"===i,title:"Verify using Okta Verify code"},{tester:"mfa-verify"===e&&"challenge-authenticator"===a&&"push"===i,title:"Verify using Okta Verify push"},{tester:"mfa-verify"===e&&"challenge-poll"===a&&"push"===i,title:"Verify using Okta Verify push"}].find((function(t){return t.tester}));return n&&n.title||o(a||e||"")}e.init=function(t,e){var r=null!=e?e:{},o=r.companyName,u=r.onTitleChange;t.on("afterRender",(function(t){var e=o?"".concat(o," - ").concat(l(t)):l(t);if(u?u(e):document.title=e,"select-authenticator-authenticate"===t.formName&&(i(".mfa-custom-app-logo",{"aria-label":"Verify using custom push app"}),i(".mfa-custom-factor",{"aria-label":"Verify using custom IDP Authenticator"}),i(".mfa-duo",{"aria-label":"Verify using Duo Security"}),i(".mfa-google-auth",{"aria-label":"Verify using Google Authenticator"}),i(".mfa-hotp",{"aria-label":"Verify using Custom OTP"}),i(".mfa-okta-email",{"aria-label":"Verify using email"}),i(".mfa-okta-password",{"aria-label":"Verify using password"}),i(".mfa-okta-phone",{"aria-label":"Verify using phone"}),i(".mfa-okta-security-question",{"aria-label":"Verify using Security Question"}),i(".mfa-okta-verify",{"aria-label":"Verify using Okta Verify"}),i(".mfa-onprem",{"aria-label":"Verify using Custom On-prem"}),i(".mfa-rsa",{"aria-label":"Verify using RSA SecurID"}),i(".mfa-symantec",{"aria-label":"Verify using Symantec VIP"}),i(".mfa-webauthn",{"aria-label":"Verify using Security key or Biometric Authenticator"}),i(".mfa-yubikey",{"aria-label":"Verify using Yubikey"}),i('.authenticator-button[data-se="custom_otp"] a',{"aria-label":"Verify using Custom OTP"}),i('.authenticator-button[data-se="duo"] a',{"aria-label":"Verify using Duo Security"}),i('.authenticator-button[data-se="external_idp"] a',{"aria-label":"Verify using IDP Authenticator"}),i('.authenticator-button[data-se="google_otp"] a',{"aria-label":"Verify using Google Authenticator"}),i('.authenticator-button[data-se="okta_email"] a',{"aria-label":"Verify using email"}),i('.authenticator-button[data-se="okta_password"] a',{"aria-label":"Verify using password"}),i('.authenticator-button[data-se="okta_verify-push"] a',{"aria-label":"Verify using Okta Verify (Push Notification)"}),i('.authenticator-button[data-se="okta_verify-totp"] a',{"aria-label":"Verify using Okta Verify (Code)"}),i('.authenticator-button[data-se="okta_verify"] a',{"aria-label":"Verify using Okta Verify"}),i('.authenticator-button[data-se="onprem_mfa-otp"] a',{"aria-label":"Verify using custom on-prem authenticator"}),i('.authenticator-button[data-se="phone_number"] a',{"aria-label":"Verify using phone"}),i('.authenticator-button[data-se="rsa_token-otp"] a',{"aria-label":"Verify using RSA SecurID"}),i('.authenticator-button[data-se="security_question"] a',{"aria-label":"Verify using security question"}),i('.authenticator-button[data-se="symantec_vip"] a',{"aria-label":"Verify using Symantec VIP"}),i('.authenticator-button[data-se="webauthn"] a',{"aria-label":"Verify using Security key or Biometric Authenticator"}),i('.authenticator-button[data-se="yubikey_token"] a',{"aria-label":"Verify using Yubikey"})),"select-authenticator-enroll"===t.formName&&(i(".mfa-custom-app-logo",{"aria-label":"Enroll custom push app"}),i(".mfa-custom-factor",{"aria-label":"Enroll custom IDP Authenticator"}),i(".mfa-duo",{"aria-label":"Enroll Duo Security"}),i(".mfa-google-auth",{"aria-label":"Enroll Google Authenticator"}),i(".mfa-hotp",{"aria-label":"Enroll Custom OTP"}),i(".mfa-okta-email",{"aria-label":"Enroll email"}),i(".mfa-okta-password",{"aria-label":"Enroll password"}),i(".mfa-okta-phone",{"aria-label":"Enroll phone"}),i(".mfa-okta-security-question",{"aria-label":"Enroll Security Question"}),i(".mfa-okta-verify",{"aria-label":"Enroll Okta Verify"}),i(".mfa-onprem",{"aria-label":"Enroll Custom On-prem"}),i(".mfa-rsa",{"aria-label":"Enroll RSA SecurID"}),i(".mfa-symantec",{"aria-label":"Enroll Symantec VIP"}),i(".mfa-webauthn",{"aria-label":"Enroll Security key or Biometric Authenticator"}),i(".mfa-yubikey",{"aria-label":"Enroll Yubikey"}),i('.authenticator-button[data-se="custom_otp"] a',{"aria-label":"Enroll custom OTP"}),i('.authenticator-button[data-se="duo"] a',{"aria-label":"Enroll Duo Security"}),i('.authenticator-button[data-se="external_idp"] a',{"aria-label":"Enroll IDP Authenticator"}),i('.authenticator-button[data-se="google_otp"] a',{"aria-label":"Enroll Google Authenticator"}),i('.authenticator-button[data-se="okta_email"] a',{"aria-label":"Enroll email"}),i('.authenticator-button[data-se="okta_password"] a',{"aria-label":"Enroll password"}),i('.authenticator-button[data-se="okta_verify-push"] a',{"aria-label":"Enroll Okta Verify (Push Notification)"}),i('.authenticator-button[data-se="okta_verify-totp"] a',{"aria-label":"Enroll Okta Verify (Code)"}),i('.authenticator-button[data-se="okta_verify"] a',{"aria-label":"Enroll Okta Verify"}),i('.authenticator-button[data-se="onprem_mfa-otp"] a',{"aria-label":"Enroll custom on-prem authenticator"}),i('.authenticator-button[data-se="phone_number"] a',{"aria-label":"Enroll phone"}),i('.authenticator-button[data-se="rsa_token-otp"] a',{"aria-label":"Enroll RSA SecurID"}),i('.authenticator-button[data-se="security_question"] a',{"aria-label":"Enroll security question"}),i('.authenticator-button[data-se="symantec_vip"] a',{"aria-label":"Enroll Symantec VIP"}),i('.authenticator-button[data-se="webauthn"] a',{"aria-label":"Enroll Security key or Biometric Authenticator"}),i('.authenticator-button[data-se="yubikey_token"] a',{"aria-label":"Enroll Yubikey"})),i('input[name="identifier"]',{autocomplete:"username"}),i('input[name="userProfile.email"]',{autocomplete:"email"}),i('input[name="userProfile.lastName"]',{autocomplete:"family-name"}),i('input[name="userProfile.firstName"]',{autocomplete:"given-name"}),document.querySelectorAll(".password-toggle").forEach((function(t){var e=t.parentNode;if(e){var r=null==e?void 0:e.querySelector(".password-with-toggle");if(r){a(t.children).forEach((function(e){return t.removeChild(e)}));var i=document.createElement("button"),o=function(){var t="password"!==r.type;i.type="button",t?(i.ariaLabel="Hide password",i.className="eyeicon visibility-off-16"):(i.ariaLabel="Show password",i.className="eyeicon visibility-16")};o(),i.onclick=function(){r.type="password"===r.type?"text":"password",o()},t.appendChild(i)}}})),n.some((function(e){return r=e,i=t,a(Object.keys(r)).every((function(t){return r[t]===i[t]}));var r,i})))var r=0,c=setInterval((function(){document.querySelector(".infobox-warning")&&(document.querySelectorAll(".infobox-warning").forEach((function(t){if(0===r)t.setAttribute("aria-live","assertive");else{var e=t.parentElement;null==e||e.removeChild(t),t.setAttribute("aria-live","assertive"),null==e||e.appendChild(t)}})),clearInterval(c)),r++}),1500),s=setInterval((function(){document.querySelector(".resend-link")&&(document.querySelectorAll(".resend-link").forEach((function(t){return t.setAttribute("href","javascript:void(0);")})),clearInterval(s))}),1500)}))}}(),t}()}));
//# sourceMappingURL=okta-plugin-a11y.js.map