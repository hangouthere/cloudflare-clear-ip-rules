import * as React from 'react';
import type { FC } from 'react';
import { Text, TextProps } from 'ink';

export interface Props {
  propsUnselected?: TextProps;
  propsSelected?: TextProps;
  isSelected?: boolean;
  label: string;
}

const DefaultProps = {
  unselected: {
    color: 'grey'
  },
  selected: {
    color: 'white',
    backgroundColor: 'cyan'
  }
};

const Item: FC<Props> = ({
  isSelected = false,
  label,
  propsSelected = DefaultProps.selected,
  propsUnselected = DefaultProps.unselected
}) => {
  const propsToSpread = isSelected ? propsSelected : propsUnselected;
  return <Text {...propsToSpread}>{label}</Text>;
};

export default Item;
