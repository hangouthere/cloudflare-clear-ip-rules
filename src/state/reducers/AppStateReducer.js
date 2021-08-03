export const AppStateActions = {
  SET_STATUS: 'APP_STATE_SET_STATUS',
  SET_CONFIGURED: 'APP_STATE_SET_CONFIGURED',
  SET_SCANNING: 'APP_STATE_SET_CONFIGURED'
};

export const AppStates = {
  CUSTOM: 'APP_STATE_CUSTOM',
  CLEARING_IP: 'APP_STATE_CLEARING_IP',
  CONFIGURING: 'APP_STATE_CONFIGURING',
  FETCH_NEXT_PAGE: 'APP_STATE_FETCH_NEXT_PAGE',
  GET_INIT_DATA: 'APP_STATE_GET_INIT_DATA',
  LOADING: 'APP_STATE_LOADING'
};

export const InitialAppState = {
  status: 'Loading...',
  isConfigured: false,
  isScanning: false
};

// !! ///////////////////////////////////////////////////////////////////////////////////////

const _getStatus = payload => {
  const { status } = payload;

  switch (status) {
    case AppStates.CUSTOM:
      return payload.message;
    case AppStates.CLEARING_IP:
      const { ip } = payload;
      return `Clearing IP - (${ip})`;
    case AppStates.CONFIGURING:
      return 'Configuring...';
    case AppStates.FETCH_NEXT_PAGE:
      const { page, total_pages } = payload;
      return `Getting next set of IPs: Page ${page} of ${total_pages}`;
    case AppStates.GET_INIT_DATA:
      return 'Retrieving Initial Data from Cloudflare...';
    case AppStates.LOADING:
      return 'Loading...';
    default:
      return payload;
  }
};

// !! ///////////////////////////////////////////////////////////////////////////////////////

export const AppStateReducer = (state, { type, payload }) => {
  switch (type) {
    case AppStateActions.SET_STATUS:
      return {
        ...state,
        status: _getStatus(payload)
      };
    case AppStateActions.SET_CONFIGURED:
      return {
        ...state,
        isConfigured: payload
      };
    case AppStateActions.SET_SCANNING:
      return {
        ...state,
        status: payload
          ? 'Initializing Clearing Scan...'
          : 'Clearing Scan Complete!'
      };

    default:
      return state;
  }
};
