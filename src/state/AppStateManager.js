import { useReducer } from 'react';
import { AppStates } from './reducers/AppStateReducer';
import { _RootReducer } from './reducers/_RootReducer';

export const InitialStoreState = {
  AppState: AppStates.LOADING
}


export default AppStateManager = (props) => {
  const [state, dispatch] = useReducer(
    _RootReducer,
    initialState /*, init // this would init data from 3rd party like localStorage */
  );
};
