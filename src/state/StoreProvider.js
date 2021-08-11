import React, { createContext, useMemo, useReducer } from 'react';
import { _InitialRootState, _RootReducer } from './reducers/_RootReducer';

export const StoreContext = createContext();

export const StoreProvider = props => {
  const { children, token = null, email = null } = props;

  const [state, dispatch] = useReducer(_RootReducer, {
    ..._InitialRootState,
    CloudflareConfig: { token, email }
  });

  // Memoize for nested objects/arrays to avoid superfluous rendering
  const PROVIDER_VALUE = useMemo(
    () => ({
      state,
      dispatch
    }),
    [state]
  );

  return (
    <StoreContext.Provider value={PROVIDER_VALUE}>
      {children}
    </StoreContext.Provider>
  );
};
