import { LogLevel } from '@azure/msal-browser';

 /**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */

 export const msalConfig = {
     auth: {
         clientId: '985813fd-7adb-4269-9e3c-1156257eb804', // Entra app id.
         authority: 'https://login.microsoftonline.com/720b637a-655a-40cf-816a-f22f40755c2c/oauth2/v2.0/authorize',  //'https://login.microsoftonline.com/720b637a-655a-40cf-816a-f22f40755c2c', // Tenant info
         redirectUri: 'http://localhost:3000/redirect', // Points to window.location.origin, URI setup in Microsoft Entra admin center/App Registration.
         postLogoutRedirectUri: '/', // Indicates the page to navigate after logout.
         navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
     },
     cache: {
         cacheLocation: 'sessionStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives  SSO between tabs.
         storeAuthStateInCookie: false, // Set this to "true" for issues on IE11 or Edge
     },
     system: {
         loggerOptions: {
             loggerCallback: (level, message, containsPii) => {
                 if (containsPii) {
                     return;
                 }
                 switch (level) {
                     case LogLevel.Error:
                         console.error(message);
                         return;
                     case LogLevel.Info:
                         console.info(message);
                         return;
                     case LogLevel.Verbose:
                         console.debug(message);
                         return;
                     case LogLevel.Warning:
                         console.warn(message);
                         return;
                     default:
                         return;
                 }
             },
         },
     },
 };

 /**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
 export const loginRequest = {
    scopes: [
        'UserAuthenticationMethod.ReadWrite.All',
        /*"User.Read", // Optional, for user profile access
        "User.ReadWrite.All" 
                //'https://graph.microsoft.com/.default',
*/
    ]
};

 /**
 * An optional silentRequest object can be used to achieve silent SSO
 * between applications by providing a "login_hint" property.
 */
 // export const silentRequest = {
 //     scopes: ["openid", "profile"],
 //     loginHint: "example@domain.net"
 // };