export const CloudflareConfigActions = {
  SET_CONFIG: 'CLOUDFLARE_CONFIG_SET_CONFIG',
  SET_ERROR: 'CLOUDFLARE_CONFIG_SET_ERROR'
};

export const InitialCloudflareConfigState = {
  error: null,
  email: null,
  token: null
};

// !! ///////////////////////////////////////////////////////////////////////////////////////

export const CloudflareConfigReducer = (state, { type, payload }) => {
  switch (type) {
    case CloudflareConfigActions.SET_CONFIG:
      const { email, token } = payload;
      return {
        ...state,
        email,
        token,
        error: null
      };

    case CloudflareConfigActions.SET_ERROR:
      return {
        error: `Some stupid error: ${payload}`
      };
    default:
      return state;
  }
};
