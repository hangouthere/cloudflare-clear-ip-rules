import chalk from 'chalk';

export const AppActions = {
  SET_MODE: 'APP_ACTION_SET_MODE',
  SET_STATUS_MSG: 'APP_ACTION_SET_STATUS_MSG'
};

export const AppStatuses = {
  CLEARING_IP: 'APP_STATUS_CLEARING_IP',
  CONFIGURING: 'APP_STATUS_CONFIGURING',
  ERRORED: 'APP_STATUS_ERRORED',
  FETCH_NEXT_PAGE: 'APP_STATUS_FETCH_NEXT_PAGE',
  GET_INIT_DATA: 'APP_STATUS_GET_INIT_DATA',
  READY: 'APP_STATUS_LOADING',
  READY_TO_SCAN: 'APP_STATUS_READY_TO_SCAN'
};

export const AppModes = {
  CONFIGURE: 'APP_MODE_CONFIGURE',
  MENU: 'APP_MODE_MENU',
  SCANNING: 'APP_MODE_SCANNING'
};

export const InitialAppState = {
  mode: AppModes.MENU,
  statusMessage: ''
};

// !! ///////////////////////////////////////////////////////////////////////////////////////

const _getStatus = payload => {
  const { status } = payload;

  switch (status) {
    case AppStatuses.ERRORED:
      return chalk.bgRed.white('- Error -') + ' ' + chalk.red(payload.error);
    case AppStatuses.CLEARING_IP:
      return `Clearing IP - (${payload.ip})`;
    case AppStatuses.CONFIGURING:
      return 'Configuring Cloudflare API';
    case AppStatuses.FETCH_NEXT_PAGE:
      const { page, total_pages } = payload;
      return `Getting next set of IPs: Page ${page} of ${total_pages}`;
    case AppStatuses.GET_INIT_DATA:
      return 'Retrieving Initial Data from Cloudflare...';

    case AppStatuses.READY:
      return 'Welcome! Please Configure the Cloudflare Settings.';
    case AppStatuses.READY_TO_SCAN:
      return 'Ready to Scan...';

    default:
      return '';
  }
};

// !! ///////////////////////////////////////////////////////////////////////////////////////

export const AppStateReducer = (state, { type, payload }) => {
  switch (type) {
    case AppActions.SET_STATUS_MSG:
      return {
        ...state,
        statusMessage: _getStatus(payload)
      };
    case AppActions.SET_CONFIGURATION:
      return {
        ...state,
        isConfigured: payload
      };
    case AppActions.SET_SCANNING:
      return {
        ...state,
        statusMessage: payload
          ? 'Initializing Clearing Scan...'
          : 'Clearing Scan Complete!'
      };
    case AppActions.SET_MODE:
      return {
        ...state,
        mode: payload
      };

    default:
      return state;
  }
};
