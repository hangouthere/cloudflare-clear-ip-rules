import React, { createContext, useReducer } from 'react';
import _RootReducer, { _RootDefault } from './reducers/_RootReducer';

export const StoreContext = createContext();

export const StoreProvider = (props) => {
    const [RootState, dispatch] = useReducer(_RootReducer, _RootDefault);

    const PROVIDER_VALUE = {RootState, dispatch};

  return (
    <StoreContext.Provider value={PROVIDER_VALUE}>
      {props.children}
    </StoreContext.Provider>
  );
};
