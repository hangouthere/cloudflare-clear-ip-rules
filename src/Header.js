import { Box, Text } from 'ink';
import React, { useEffect, useState } from 'react';

import Figlet from 'figlet';
import tinygradient from 'tinygradient';
import useInterval from 'react-useinterval';

//TODO: convert to useEffect/useRef storage
const gradient = tinygradient('#F48120', '#555').rgb(30);

export default Header = ({
  title = 'Title Placeholder',
  font = 'Standard',
  verticalLayout = 'default',
  horizontalLayout = 'default',
  color = 'white'
}) => {
  const [step, setStep] = useState(0);
  const [logoColor, setLogoColor] = useState(0);

  useInterval(
    () => {
      setStep(step + 1);
    },
    step < gradient.length - 1 ? 50 : null
  );

  useEffect(() => {
    const rgb =
      'rgb(' +
      Math.round(gradient[step]._r) +
      ',' +
      Math.round(gradient[step]._g) +
      ',' +
      Math.round(gradient[step]._b) +
      ')';

    setLogoColor(rgb);
  }, [step]);

  const lines = Figlet.textSync(title, {
    font,
    horizontalLayout,
    verticalLayout
  })
    .split('\n')
    .slice(0, -1);

  return (
    <Box flexDirection="column">
      {lines.map((txt, idx) => (
        <Text key={idx} color={logoColor}>
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
