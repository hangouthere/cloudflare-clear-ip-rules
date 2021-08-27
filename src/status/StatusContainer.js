import React, { useContext } from 'react';

import { AppModes } from '../state/reducers/AppStateReducer';
import { Box } from 'ink';
import CFConfig from './CFConfig';
import Progress from './Progress';
import Status from './Status';
import { StoreContext } from '../state/StoreProvider';

export default ({}) => {
  const { state } = useContext(StoreContext);

  const {
    App: { statusMessage, mode },
    CloudflareConfig,
    Scanner
  } = state;

  const isConfigured = !!CloudflareConfig.email && !!CloudflareConfig.token;
  const isScanning = mode === AppModes.SCANNING;

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor="grey"
      paddingX={1}
    >
      <Status {...{ statusMessage }} />
      {isConfigured && <CFConfig {...CloudflareConfig} />}
      {isScanning && <Progress {...Scanner} />}
    </Box>
  );
};
