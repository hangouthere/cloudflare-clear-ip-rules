import { Box } from 'ink';
import { createElement, useContext } from 'react';

import { StoreContext } from './state/StoreProvider';
import { AppModes } from './state/reducers/AppStateReducer';

import ConfigureView from './views/ConfigureView';
import MenuManagerView from './views/menus/MenuManagerView';

const Views = {
  [AppModes.MENU]: MenuManagerView,
  [AppModes.CONFIGURE]: ConfigureView
};

export default ViewManager = () => {
  const {
    state: {
      App: { mode }
    }
  } = useContext(StoreContext);

  return (
    <Box borderStyle="round" borderColor="gray" paddingX={1} flexGrow>
      {createElement(Views[mode])}
    </Box>
  );
};
