import chalk from 'chalk';
import { Box, Text } from 'ink';
import React from 'react';

import ProgressBar from '_Shared/ProgressBar';

export default ({ currIP, numIPs }) => {
  const percent = numIPs ? currIP / numIPs : 0;

  return (
    <Box flexDirection="row">
      {/* Progress Bar */}
      <ProgressBar
        percent={percent}
        columns={15}
        label={chalk.magenta('Progress')}
        charEmpty={chalk.gray('░')}
        charFilled={chalk.green('█')}
        borderLeft={chalk.gray('[')}
        borderRight={chalk.gray(']')}
      />

      <Box marginRight={1}>
        <Text color="grey">{Math.round(percent * 100)}%</Text>
      </Box>

      {/* NumIPs */}
      <Box flexDirection="row">
        <Box marginRight={1}>
          <Text>
            <Text color="grey">| </Text>
            <Text color="yellow">Num IPs</Text>: {numIPs}
            <Text color="grey"> |</Text>
          </Text>
        </Box>

        <Text>
          <Text color="green">Curr IP</Text>: {currIP}
        </Text>
      </Box>
    </Box>
  );
};
