export const CloudflareConfigActions = {
  SET_CONFIG: 'CLOUDFLARE_CONFIG_SET_CONFIG'
};

export const InitialCloudflareConfigState = {
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
        token
      };

    default:
      return state;
  }
};
