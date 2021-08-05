import { Box } from 'ink';
import path from 'path';
import React from 'react';

import Header from './Header';
import ViewManager from './ViewManager';

import { StoreProvider } from './state/StoreProvider';

import StatusContainer from './status/StatusContainer';
import StoreSaver from './state/StoreSaver';

globalThis.__dirname = path.resolve();

const APP_WIDTH = 91;
const APP_HEIGHT = 25;

export default App = ({ name = 'Stranger' }) => {
  return (
    <StoreProvider>
      <StoreSaver>
        <Box
          minHeight={10}
          width={APP_WIDTH}
          minHeight={APP_HEIGHT}
          borderStyle="round"
          borderColor="#fc7f03"
          flexDirection="column"
        >
          <Header title="Cloudflare Clear" font="Rounded" color="#888888" />

          <StatusContainer />

          <ViewManager />
        </Box>
      </StoreSaver>
    </StoreProvider>
  );
};
