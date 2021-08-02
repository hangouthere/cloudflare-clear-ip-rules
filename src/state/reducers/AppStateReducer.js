export const AppStates = {
  CLEARING_IP: 'APP_STATE_CLEARING_IP',
  CONFIGURING: 'APP_STATE_CONFIGURING',
  FETCH_NEXT_PAGE: 'APP_STATE_FETCH_NEXT_PAGE',
  GET_INIT_DATA: 'APP_STATE_GET_INIT_DATA',
  LOADING: 'APP_STATE_LOADING',
};

export const AppStateReducer = (state, { type, payload }) => {
  switch (type) {
    case AppStates.CLEARING_IP:
      return `Clearing IP - (${payload})`;
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
      return state;
  }
};
