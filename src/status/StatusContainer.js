import React, { useContext } from 'react';
import { Box } from 'ink';

import { AppContext } from '../App';
import Status from './Status';
import CFConfig from './CFConfig';
import Progress from './Progress';

export default StatusArea = ({}) => {
  const ctx = useContext(AppContext);

  const {
    status: {
      app: appStatus,
      scan: { numIPs, currIP },
    },

    cf: { email, token },
  } = ctx;

  return (
    <Box
      flexDirection="column"
      borderStyle="single"
      borderColor="grey"
      paddingX={1}
    >
      <Status {...{ appStatus }} />
      { !!token && !!email && <CFConfig {...{ token, email }} /> }
      { !!currIP && !!numIPs && <Progress {...{ currIP, numIPs }} />}
    </Box>
  );
};
