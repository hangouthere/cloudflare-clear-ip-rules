import { Box } from 'ink';
import React, { useContext } from 'react';

import CFConfig from './CFConfig';
import Progress from './Progress';
import Status from './Status';

import { StoreContext } from '../state/StoreProvider';
import { AppModes } from '../state/reducers/AppStateReducer';

export default StatusContainer = ({}) => {
  const { state } = useContext(StoreContext);

  const {
    App: { statusMessage, isConfigured, mode },
    CloudflareConfig,
    Scanner
  } = state;

  const isScanning = mode === AppModes.SCANNING;

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor="grey"
      paddingX={1}
    >
      <Status {...{ statusMessage }} />
      {isConfigured && <CFConfig {...{ CloudflareConfig }} />}
      {isScanning && <Progress {...{ Scanner }} />}
    </Box>
  );
};
