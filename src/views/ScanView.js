import { Box, Text, useApp, useInput } from 'ink';
import React, { useContext, useEffect, useRef, useState } from 'react';

import MenuScan from './menus/MenuScan';
import { ScannerActions } from '../state/reducers/ScannerReducer';
import { StoreContext } from '../state/StoreProvider';
import ViewRunner from './ViewRunner';

const ScannerLog = logEntries => (
  <Box flexDirection="column" flexGrow={1}>
    {logEntries.slice(-20).map(entry => (
      <Text key={entry.time}>{entry.message}</Text>
    ))}
  </Box>
);

export default () => {
  const {
    dispatch,
    state: { CloudflareConfig }
  } = useContext(StoreContext);

  const { exit } = useApp();
  const [isScanning, setScanning] = useState(false);
  const [logEntries, setLogEntries] = useState([]);
  const runner = useRef();

  const handleStartScan = () => {
    setScanning(true);
  };

  const addLogEntry = logEntry => {
    setLogEntries(oldEntries => [
      ...oldEntries,
      {
        time: Date.now(),
        message: logEntry
      }
    ]);
  };

  const updateCurrent = currIP => {
    dispatch({
      type: ScannerActions.SET_CURRENT,
      payload: currIP
    });
  };

  const setTotals = ({ numIPs }) => {
    dispatch({
      type: ScannerActions.SET_TOTALS,
      payload: {
        numIPs
      }
    });
  };

  useEffect(() => {
    // Only process if !!isScanning
    if (!isScanning || runner.current) {
      return;
    }

    //@ts-ignore
    runner.current = new ViewRunner({
      config: CloudflareConfig,
      addLogEntry,
      updateCurrent,
      setTotals
    });

    //@ts-ignore
    runner.current.run();
  }, [isScanning]);

  // Handle Exit when Done
  useInput(input => {
    if (isScanning && input) {
      exit();
    }
  });

  const ScannerMenu = <MenuScan handleStartScan={handleStartScan} />;

  return isScanning ? ScannerLog(logEntries) : ScannerMenu;
};
