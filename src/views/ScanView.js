import { Box, Text, useApp, useInput } from 'ink';
import React, { useEffect, useRef, useState } from 'react';

import MenuScan from './menus/MenuScan';
import { StoreContext } from '../state/StoreProvider';
import { ViewRunner } from '../ViewRunner';

const ScannerLog = logEntries => (
  <Box flexDirection="column" flexGrow>
    {logEntries.map((entry, idx) => (
      <Text key={idx}>{entry}</Text>
    ))}
  </Box>
);

export default ScanView = () => {
  const {
    dispatch,
    state: { CloudflareConfig }
  } = useContext(StoreContext);

  const { exit } = useApp();
  const [isScanning, setScanning] = useState(false);
  const [logEntries, setLogEntries] = useState([]);
  const runner = useRef();

  useEffect(() => {
    runner.current = new ViewRunner({
      config: CloudflareConfig,
      setLogEntries,
      dispatch
    });

    runner.run();
  }, []);

  // Handle Exit when Done
  useInput((input, key) => {
    if (isScanning && input) {
      exit();
    }
  });

  const handleStartScan = () => {
    setScanning(true);
  };

  const ScannerMenu = <MenuScan handleStartScan={handleStartScan} />;

  return isScanning ? ScannerLog(logEntries) : ScannerMenu;
};
