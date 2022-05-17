/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
const msalConfig = {
  auth: {
    clientId: '7a993222-b95d-4731-83ee-3cda4df5cbab',
    authority: 'https://login.microsoftonline.com/79c23601-6d96-4d3a-9f15-0e6e65d2e8b3',
    redirectUri: 'http://localhost:3000/',
  },
  cache: {
    cacheLocation: 'localStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
const loginRequest = {
  scopes: ['User.Read'],
};

const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};

/**
 * Add here the scopes to request when obtaining an access token for MS Graph API. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
const tokenRequest = {
  scopes: ['User.Read'],
  forceRefresh: false, // Set this to "true" to skip a cached token and go to the server to get a new token
};

export { msalConfig, loginRequest, tokenRequest, graphConfig };
