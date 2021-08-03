import { combineReducers } from '_Shared/reducerUtils';
import { AppStateReducer, InitialAppState } from './AppStateReducer';
import {
  CloudflareConfigReducer,
  InitialCloudflareConfigState
} from './CloudflareConfigReducer';
import { InitialScannerState, ScannerReducer } from './ScannerReducer';

export const _InitialRootState = {
  AppState: InitialAppState,
  CloudflareConfig: InitialCloudflareConfigState,
  Scanner: InitialScannerState
};

export const _RootReducer = combineReducers({
  AppState: AppStateReducer,
  CloudflareConfig: CloudflareConfigReducer,
  Scanner: ScannerReducer
});
