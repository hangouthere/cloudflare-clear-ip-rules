import { AppActions, AppStatuses } from '../state/reducers/AppStateReducer';
import React, { useContext, useEffect } from 'react';

import MenuConfigured from './menus/MenuConfigured';
import MenuUnconfigured from './menus/MenuUnconfigured';
import { StoreContext } from '../state/StoreProvider';

export default MenuManagerView = () => {
  const {
    dispatch,
    state: {
      CloudflareConfig: { email, token }
    }
  } = useContext(StoreContext);

  const isConfigured = email && token;

  useEffect(() => {
    dispatch({
      type: AppActions.SET_STATUS_MSG,
      payload: {
        status: isConfigured ? AppStatuses.READY_TO_SCAN : AppStatuses.READY
      }
    });
  }, []);

  return isConfigured ? <MenuConfigured /> : <MenuUnconfigured />;
};
