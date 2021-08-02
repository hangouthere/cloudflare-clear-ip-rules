import { AppStateReducer, AppStates } from './AppStateReducer';

export const _RootReducer = {
    AppState: AppStateReducer
}

export const _RootDefaultState = {
    AppState: AppStates.LOADING
}
