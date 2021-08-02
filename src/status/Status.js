import React from 'react';
import { Box, Text } from 'ink';

export default ({ appStatus }) => {
  return (
    <Box justifyContent="space-between">
      <Box paddingRight={1}>
        <Text color="cyanBright">Status: </Text>
        <Text>{appStatus}</Text>
      </Box>
    </Box>
  );
};
