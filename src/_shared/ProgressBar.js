import { Box, Text } from 'ink';

import React from 'react';

const BuildPercentFill = props => {
  const { percent, columns, charEmpty, charFilled } = props;

  const numFilled = Math.min(Math.floor(columns * percent), columns);
  const strFilled = charFilled.repeat(numFilled);
  const strEmpty = charEmpty.repeat(columns - numFilled);

  console.log(charEmpty);

  return `${strFilled}${strEmpty}`;
};

const BuildPercentBar = props => {
  const { label, charLeft, charRight } = props;

  return (
    <Box marginRight={1}>
      <Text>{label}: </Text>
      <Text>{charLeft}</Text>
      <Text>{BuildPercentFill(props)}</Text>
      <Text>{charRight}</Text>
    </Box>
  );
};

const DEFAULT_PROPS = {
  label: 'Progress',
  columns: 20,
  percent: 0,
  charEmpty: '░',
  charFilled: '█',
  charLeft: '[',
  charRight: ']'
};

export default ProgressBar = props => {
  const buildProps = { ...DEFAULT_PROPS, ...props };

  return BuildPercentBar(buildProps);
};
