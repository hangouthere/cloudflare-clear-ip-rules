import path from 'path';
import React, { useContext, useEffect } from 'react';
import { Box } from 'ink';
import * as Conf from 'conf';

import Header from './Header';
import StatusContainer from './status/StatusContainer';

const __dirname = path.resolve();

const APP_WIDTH = 91;
const APP_HEIGHT = 25;

const AppStore = new Conf({
  cwd: __dirname,
  configName: '.config',
});

const DefaultContext = {
  ...AppStore.store,
  status: {
    app: 'Loading...',

    scan: {
      numIPs: 0,
      currIP: 0,
    },
  },

  cf: {
    email: null,
    token: null,
  },
};
export const AppContext = React.createContext(DefaultContext);

export default App = ({ name = 'Stranger' }) => {
  const ctx = useContext(AppContext);

  useEffect(() => {
    console.log('Context Updated!!!!', ctx);
  }, [ctx]);

  return (
    <Box
      minHeight={10}
      width={APP_WIDTH}
      height={APP_HEIGHT}
      borderStyle="round"
      borderColor="#fc7f03"
      flexDirection="column"
    >
      <Header title="Cloudflare Clear" font="Rounded" color="#888888" />

      <StatusContainer />
    </Box>
  );
};
