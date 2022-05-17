<template>
  <div class="">
    <img alt="Vue logo" src="./assets/logo.png" />
    <br />
    <button @click="signIn" style="margin-bottom: 10px">login</button>
    <br />
    <button @click="seeProfile" style="margin-bottom: 10px">see profile</button>
    <div v-if="showUser">Hello {{ username }}</div>
    <div class="">
      <h1>Profile</h1>
      <p>{{ profile.displayName }}</p>
      <p>{{ profile.givenName }}</p>
      <p>{{ profile.id }}</p>
      <p>{{ profile.jobTitle }}</p>
      <p>{{ profile.mail }}</p>
      <p>{{ profile.mobilePhone }}</p>
      <p>{{ profile.surname }}</p>
      <p>{{ profile.userPrincipalName }}</p>
    </div>
  </div>
</template>

<script>
import * as msal from "@azure/msal-browser";
import { msalConfig, loginRequest, graphConfig } from "@/authConfig.js";
const msalInstance = new msal.PublicClientApplication(msalConfig);

export default {
  name: "App",
  data() {
    return {
      username: "",
      showUser: false,
      profile: {},
    };
  },
  mounted() {
    msalInstance
      .handleRedirectPromise()
      .then(this.handleResponse)
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    handleResponse(response) {
      if (response !== null) {
        this.username = response.account.username;
        this.showWelcomeMessage(this.username);
      } else {
        this.selectAccount();
      }
    },
    selectAccount() {
      /**
       * See here for more info on account retrieval:
       * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
       */
      const currentAccounts = msalInstance.getAllAccounts();
      if (currentAccounts.length === 0) {
        return;
      } else if (currentAccounts.length > 1) {
        // Add your account choosing logic here - in this case I'm just selecting the first account
        this.username = currentAccounts[0].username;
        this.showWelcomeMessage(this.username);
        console.warn("Multiple accounts detected.");
      } else if (currentAccounts.length === 1) {
        this.username = currentAccounts[0].username;
        this.showWelcomeMessage(this.username);
      }
    },
    getTokenRedirect(request) {
      /**
       * See here for more info on account retrieval:
       * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
       */
      request.account = msalInstance.getAccountByUsername(this.username);

      return msalInstance.acquireTokenSilent(request).catch((error) => {
        console.warn(
          "silent token acquisition fails. acquiring token using redirect"
        );
        if (error instanceof msal.InteractionRequiredAuthError) {
          // fallback to interaction when silent call fails
          return msalInstance.acquireTokenRedirect(request);
        } else {
          console.warn(error);
        }
      });
    },
    signIn() {
      /**
       * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
       * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
       */

      msalInstance.loginRedirect();
    },
    signOut() {
      /**
       * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
       * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
       */

      const logoutRequest = {
        account: msalInstance.getAccountByUsername(this.username),
        postLogoutRedirectUri: msalConfig.auth.redirectUri,
      };

      msalInstance.logoutRedirect(logoutRequest);
    },
    showWelcomeMessage() {
      this.showUser = true;
    },
    seeProfile() {
      this.getTokenRedirect(loginRequest)
        .then((response) => {
          const headers = new Headers();
          const bearer = `Bearer ${response.accessToken}`;

          headers.append("Authorization", bearer);

          const options = {
            method: "GET",
            headers: headers,
          };

          console.log("request made to Graph API at: " + new Date().toString());

          fetch(graphConfig.graphMeEndpoint, options)
            .then((response) => response.json())
            .then((response) => {
              console.log(response);
              this.profile = response;
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>


