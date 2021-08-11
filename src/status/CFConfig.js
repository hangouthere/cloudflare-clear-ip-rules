import { Box, Text } from 'ink';

import Chalk from 'chalk';
import React from 'react';

export default CFConfig = ({ token, email }) => {
  const strToken =
    token.substr(0, 3) +
    Chalk.grey(
      Array(token.length - 7)
        .fill('x')
        .join('')
    ) +
    token.substr(-4);

  const [user, domain] = email.split('@');
  const strEmail =
    user.substr(0, 3) +
    Chalk.grey(
      Array(user.length - 3)
        .fill('x')
        .join('')
    ) +
    '@' +
    domain;

  return (
    <Box>
      <Box justifyContent="space-between" paddingRight={1}>
        <Text color="grey">Token: </Text>
        <Text wrap="truncate-middle">{strToken}</Text>
      </Box>

      <Box justifyContent="space-between">
        <Text color="grey">Email: </Text>
        <Text wrap="truncate-middle">{strEmail}</Text>
      </Box>
    </Box>
  );
};
