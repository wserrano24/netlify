export const useDomainVariables = () => {

  return {
    variables: {
      value: {
        BASE_URL:"/online",
        CONTENTFUL_ENDPOINT: process.env.CONTENTFUL_ENDPOINT || '',
        GOOGLE_MAPS_API: process.env.GOOGLE_MAPS_API || '',
        GTM_ID: process.env.GTM_ID || '',
        OKTA_CLIENT_ID: process.env.OKTA_CLIENT_ID || '',
        OKTA_ISSUER: process.env.OKTA_ISSUER || '',
        OKTA_ORIGIN:process.env.OKTA_ORIGIN || '',
        PLAID_LINK_TOKEN: process.env.PLAID_LINK_TOKEN || '',
        PURPOSE_ENDPOINT: process.env.PURPOSE_ENDPOINT || '',
        OLA_SEAL_URL: process.env.OLA_SEAL_URL || '',
        SWAGGER_PAYMENT_COMPOSITE: process.env.SWAGGER_PAYMENT_COMPOSITE || '',
        SWAGGER_CARD_COMPOSITE: process.env.SWAGGER_CARD_COMPOSITE || '',
        SWAGGER_EPP: process.env.SWAGGER_EPP || '',
        PRODUCT_BUSINESS: process.env.PRODUCT_BUSINESS || '',
        SWAGGER_PERSONAL_COMPOSITE: process.env.SWAGGER_PERSONAL_COMPOSITE || '',
        SWAGGER_PRODUCT_COMPOSITE: process.env.SWAGGER_PRODUCT_COMPOSITE || '',
        SWAGGER_APPLICATION_COMPOSITE: process.env.SWAGGER_APPLICATION_COMPOSITE || '',
        LOG_ROCKET_ID: process.env.LOG_ROCKET_ID || '',
        ROOT_HOSTNAME: process.env.ROOT_HOSTNAME || '',
        LOG_ROCKET_DEBUG: process.env.LOG_ROCKET_DEBUG || '',
        APP_VERSION: process.env.APP_VERSION || '',
        SPLIT_IO_CLIENT: process.env.SPLIT_IO_CLIENT || '',
        SPLIT_IO_SERVER: process.env.SPLIT_IO_SERVER || '',
        SNAP_ENGAGE_API: process.env.SNAP_ENGAGE_API || '',
        PAYMENT_MF: process.env.PAYMENT_MF || '',
        CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID || '',
        CONTENTFUL_CDA: process.env.CONTENTFUL_CDA || '',
        CONTENTFUL_PREVIEW_TOKEN: process.env.CONTENTFUL_PREVIEW_TOKEN || '',
        ON_NETLIFY: process.env.ON_NETLIFY,
        OKTA_ORIGIN_LEAD_GEN: process.env.OKTA_ORIGIN_LEAD_GEN || '',
      },
    }
  }
};
