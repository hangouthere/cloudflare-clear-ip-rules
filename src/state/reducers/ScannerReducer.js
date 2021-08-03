export const ScannerActions = {
  SET_TOTALS: 'SCANNER_SET_TOTALs',
  SET_CURRENT: 'SCANNER_SET_CURRENT',
  UPDATE_LIST: 'SCANNER_UPDATE_LIST'
};

export const InitialScannerState = {
  numIPs: 0,
  currIP: 0,
  list: []
};

// !! ///////////////////////////////////////////////////////////////////////////////////////

export const ScannerReducer = (state, { type, payload }) => {
  switch (type) {
    case ScannerActions.SET_TOTALS:
      return {
        ...state,
        ...payload,
        currIP: 0
      };
    case ScannerActions.SET_CURRENT:
      return {
        ...state,
        currIP: payload
      };
    case ScannerActions.UPDATE_LIST:
      return {
        ...state,
        list: [...state.list, payload]
      };
    default:
      return state;
  }
};
