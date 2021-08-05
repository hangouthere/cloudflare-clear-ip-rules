import { Box, Text, useApp } from 'ink';
import React, { useContext } from 'react';

import SelectInput from '_Shared/SelectInput';
import {
  AppModes,
  AppActions,
  AppStatuses
} from '../../state/reducers/AppStateReducer';
import { StoreContext } from '../../state/StoreProvider';

const MENU_ITEMS = [
  { value: 0, label: 'Configure Cloudflare Settings' },
  { value: 1, label: 'Exit' }
];

export default MenuUnconfigured = ({ items }) => {
  const { dispatch } = useContext(StoreContext);

  const { exit } = useApp();

  function handleSelectUnconfigured(item) {
    switch (item.value) {
      case 0:
        return dispatch({
          type: AppActions.SET_MODE,
          payload: AppModes.CONFIGURE
        });

      default:
        return exit();
    }
  }

  return (
    <Box flexDirection="column">
      <Text color="yellow">-= Main Menu =-</Text>

      <SelectInput
        items={MENU_ITEMS}
        onSelect={handleSelectUnconfigured}
        marginLeft={1}
      />
    </Box>
  );
};
