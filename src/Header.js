import React from 'react';
import { Box, Newline, Text } from 'ink';
import Figlet from 'figlet';

export default Header = ({
  title = 'Title Placeholder',
  font = 'Standard',
  verticalLayout = 'default',
  horizontalLayout = 'default',
  color = 'white',
}) => {
  const lines = Figlet.textSync(title, {
    font,
    horizontalLayout,
    verticalLayout,
  })
    .split('\n')
    .slice(0, -1);

  return (
    <Box flexDirection="column">
      {lines.map((txt, idx) => (
        <Text key={idx} color={color}>
          {txt}
        </Text>
      ))}

      <Box paddingLeft={61}>
        <Text>
          Made with <Text color="red">♥</Text> by{' '}
          <Text color="#F16A06">nfgCodex</Text>
        </Text>
      </Box>
    </Box>
  );
};
