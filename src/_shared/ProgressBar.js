import React from 'react';
import { Box, Text } from 'ink';

const BuildPercentFill = props => {
  const { percent, columns, charEmpty, charFilled } = props;

  const numFilled = Math.min(Math.floor(columns * percent), columns);
  const strFilled = charFilled.repeat(numFilled);
  const strEmpty = charEmpty.repeat(columns - numFilled);

  return `${strFilled}${strEmpty}`;
};

const BuildPercentBar = props => {
  const { label, borderleft, borderRight } = props;

  return (
    <Box marginRight={1}>
      <Text>{label}: </Text>
      <Text>{borderLeft}</Text>
      <Text>{BuildPercentFill(props)}</Text>
      <Text>{borderRight}</Text>
    </Box>
  );
};

const DEFAULT_PROPS = {
  label: 'Progress',
  columns: 20,
  percent: 0,
  charEmpty: '░',
  charFilled: '█',
  borderLeft: '[',
  borderRight: ']'
};

export default ProgressBar = props => {
  props = { ...DEFAULT_PROPS, ...props };

  return BuildPercentBar(props);
};
