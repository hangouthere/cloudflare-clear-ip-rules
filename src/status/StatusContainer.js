import { Box } from 'ink';
import React, { useContext } from 'react';

import CFConfig from './CFConfig';
import Progress from './Progress';
import Status from './Status';

import { StoreContext } from '../state/StoreProvider';

export default StatusContainer = ({}) => {
  const { state } = useContext(StoreContext);

  const {
    AppState: { status: appStatus, isConfigured, isScanning },
    CloudflareConfig: { email, token },
    Scanner: { numIPs, currIP }
  } = state;

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor="grey"
      paddingX={1}
    >
      <Status {...{ appStatus }} />
      {isConfigured && <CFConfig {...{ token, email }} />}
      {isScanning && <Progress {...{ currIP, numIPs }} />}
    </Box>
  );
};
