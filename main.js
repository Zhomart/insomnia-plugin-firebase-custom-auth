const nanoajax = require("nanoajax");
const jwtDecode = require("jwt-decode");
const _ = require('lodash');

const STORE_CUSTOM_TOKEN_KEY = "customToken"; // Firebase Custom Token (JWT)
const STORE_ID_TOKEN_KEY = "idToken"; // Firebase idToken (JWT)

async function nanoajaxAsync(options) {
  return new Promise((resolve, reject) => {
    nanoajax.ajax(options, function (code, responseText, request) {
      if (code === 200) {
        resolve(responseText);
      } else {
        reject(code, responseText);
      }
    });
  });
}

module.exports.templateTags = [
  {
    name: "idToken",
    displayName: "Firebase idToken",
    description:
      "Fetches idToken from Firebase using customToken. Note both tokens have 1 hour lifetime.",

    args: [
      {
        displayName: "customTokenOrEmptyToUseStored",
        description:
          "Force use this custom token instead. If empty, use the stored one.",
        type: "string",
        defaultValue: null,
      },
      {
        displayName: "firebaseKey",
        description: "Firebase Web API Key (on General Settings page)",
        type: "string",
        defaultValue: null,
      },
    ],

    async run(context, customTokenOrEmptyForStored, firebaseKey) {
      const customTokenStored = await context.store.getItem(STORE_CUSTOM_TOKEN_KEY);
      const idToken = await context.store.getItem(STORE_ID_TOKEN_KEY);
      const customTokenFinal =
        customTokenOrEmptyForStored && customTokenOrEmptyForStored.length > 0
          ? customTokenOrEmptyForStored
          : customTokenStored;
      if (idToken && idToken.length > 0) return idToken;
      if (!customTokenFinal || customTokenFinal.length == 0) {
        return (
          "No custom token supplied. Please either use X-Insomnia-Firebase-Custom-Token-Path" +
          " or set it via params."
        );
      }
      console.log("Making request to get idtoken");
      const responseRaw = await nanoajaxAsync({
        url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${firebaseKey}`,
        method: "POST",
        body: JSON.stringify({
          token: customTokenFinal,
          returnSecureToken: true,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const response = JSON.parse(responseRaw);
      await context.store.setItem(STORE_ID_TOKEN_KEY, response.idToken);
      return response.idToken;
    },
  },

  {
    name: "customToken",
    displayName: "Firebase Custom Token",
    description: "Returns stored custom token",

    async run(context) {
      const customToken = await context.store.getItem(STORE_CUSTOM_TOKEN_KEY);
      return customToken;
    },
  },
];

module.exports.responseHooks = [
  async (context) => {
    // Expected format: "data.login.firebaseCustomToken"
    const customTokenPath = context.request.getHeader(
      "X-Insomnia-Firebase-Custom-Token-Path"
    );
    if (!customTokenPath) return;
    if (context.response.getStatusCode() !== 200) return;
    console.dir("Parsing response to get customToken");
    let body = JSON.parse(context.response.getBody());
    const customToken = _.get(body, customTokenPath)
    try {
      const jwt = jwtDecode(customToken);
      if (!jwt || !jwt.aud) {
        console.warn("Bad JWT");
        return;
      }
      console.dir("Storing the custom token (it has 1 hour lifetime)");
      await context.store.setItem(STORE_CUSTOM_TOKEN_KEY, customToken);
      await context.store.removeItem(STORE_ID_TOKEN_KEY);
    } catch (error) {
      console.warn("Failed to decode custom token JWT", error);
    }
  },
];

module.exports.workspaceActions = [
  {
    label: "Reset Firebase Custom Tokens",
    icon: "fa-trash",
    action: async (context, models) => {
      await context.store.removeItem(STORE_CUSTOM_TOKEN_KEY);
      await context.store.removeItem(STORE_ID_TOKEN_KEY);
    },
  },
];
