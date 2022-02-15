import { createElement, useContext } from 'react';

import { AppModes } from '../state/reducers/AppStateReducer';
import { Box } from 'ink';
import ConfigureView from './ConfigureView';
import MenuManagerView from './MenuManagerView';
import ScanView from './ScanView';
import { StoreContext } from '../state/StoreProvider';

const Views = {
  [AppModes.MENU]: MenuManagerView,
  [AppModes.CONFIGURE]: ConfigureView,
  [AppModes.SCANNING]: ScanView
};

export default ViewManager = () => {
  const {
    state: {
      App: { mode }
    }
  } = useContext(StoreContext);

  return (
    <Box borderStyle="round" borderColor="gray" paddingX={1} flexGrow={1}>
      {createElement(Views[mode])}
    </Box>
  );
};
