import { Box, Text } from 'ink';
import path from 'path';
import React, { useContext, useEffect } from 'react';
import SelectInput from '_Shared/SelectInput';

import Header from './Header';
import { AppStateActions, AppStates } from './state/reducers/AppStateReducer';

import { StoreContext, StoreProvider } from './state/StoreProvider';

import StatusContainer from './status/StatusContainer';

globalThis.__dirname = path.resolve();

const APP_WIDTH = 91;
const APP_HEIGHT = 25;

const items = [
  {
    label: 'First',
    value: '1st'
  },
  {
    label: 'Second',
    value: '2nd'
  },
  {
    label: 'Third',
    value: '3rd'
  },
  {
    label: 'Fourth',
    value: '4th'
  },
  {
    label: 'Fifth',
    value: '5th'
  },
  {
    label: 'Sixth',
    value: '6th'
  },
  {
    label: 'Seventh',
    value: '7th'
  },
  {
    label: 'Eighth',
    value: '8th'
  },
  {
    label: 'Ninth',
    value: '9th'
  },
  {
    label: 'Tenth',
    value: '10th'
  }
];

export default App = ({ name = 'Stranger' }) => {
  const ctx = useContext(StoreContext);

  useEffect(() => {
    console.log('Context Updated!!!!', ctx);
  }, [ctx]);

  const handleSelect = item => {
    // console.log('Item selected:', item);
    // `item` = { label: 'First', value: 'first' }
    dispatch({
      type: AppStateActions.SET_STATUS,
      payload: {
        status: AppStates.CUSTOM,
        message: 'You Selected the `$item.value` item...'
      }
    });
  };

  return (
    <StoreProvider>
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
    </StoreProvider>
  );
};
