import React from 'react';
import { Box, Text } from 'ink';

export default ({ statusMessage }) => {
  return (
    <Box justifyContent="space-between">
      <Box paddingRight={1}>
        <Text color="cyanBright">Status: </Text>
        <Text>{statusMessage}</Text>
      </Box>
    </Box>
  );
};
