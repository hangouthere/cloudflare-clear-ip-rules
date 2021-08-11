import { Box } from 'ink';
import Header from './Header';
import React from 'react';
import StatusContainer from './status/StatusContainer';
import { StoreProvider } from './state/StoreProvider';
import StoreSaver from './state/StoreSaver';
import ViewManager from './views/ViewManager';

const APP_WIDTH = 91;
const APP_HEIGHT = 25;

export default App = ({ token = null, email = null }) => {
  return (
    <StoreProvider {...{ token, email }}>
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
