import * as Conf from 'conf';

import React, { createContext, useMemo, useReducer } from 'react';
import { _InitialRootState, _RootReducer } from './reducers/_RootReducer';

export const ConfigStore = new Conf({
  cwd: __dirname,
  configName: '.config'
});

export const StoreContext = createContext();

export const StoreProvider = props => {
  const [state, dispatch] = useReducer(_RootReducer, {
    ..._InitialRootState,
    CloudflareConfig: { ...ConfigStore.store }
  });

  const PROVIDER_VALUE = useMemo(
    () => ({
      state,
      dispatch
    }),
    [state]
  );

  return (
    <StoreContext.Provider value={PROVIDER_VALUE}>
      {props.children}
    </StoreContext.Provider>
  );
};
