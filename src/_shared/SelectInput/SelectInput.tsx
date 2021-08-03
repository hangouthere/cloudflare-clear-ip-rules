import { Box, BoxProps, Text, useInput } from 'ink';
import type { FC } from 'react';
import * as React from 'react';
import { useCallback, useState } from 'react';
import type { Props as ItemProps } from './ItemComponent';
import ItemComponent from './ItemComponent';
import pick = require('lodash.pick');
import arrayRotate = require('arr-rotate');
import Chalk from 'chalk';
import { useEffect } from 'react';

const PropagateProps = [
  'alignSelf',
  'borderColor',
  'borderStyle',
  'display',
  'flexBasis',
  'flexGrow',
  'flexShrink',
  'height',
  'margin',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginX',
  'marginY',
  'minHeight',
  'minWidth',
  'padding',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingX',
  'paddingY',
  'position',
  'width'
];

interface SelectInputProps<V> {
  /**
   * Items to display in a list. Each item must be an object and have `label` and `value` props, it may also optionally have a `key` prop.
   * If no `key` prop is provided, `value` will be used as the item key.
   */
  items?: Array<Item<V>>;

  /**
   * Listen to user's input. Useful in case there are multiple input components at the same time and input must be "routed" to a specific component.
   *
   * @default true
   */
  isFocused?: boolean;

  /**
   * Index of initially-selected item in `items` array.
   *
   * @default 0
   */
  initialIndex?: number;

  /**
   * Custom component to override the default indicator component.
   */
  indicatorChar?: string;

  /**
   * Custom component to override the default item component.
   */
  itemComponent?: FC<ItemProps>;

  /**
   * Function to call when user selects an item. Item object is passed to that function as an argument.
   */
  onSelect?: (item: Item<V>) => void;

  /**
   * Function to call when user highlights an item. Item object is passed to that function as an argument.
   */
  onHighlight?: (item: Item<V>) => void;
}

interface Props<V> extends SelectInputProps<V>, BoxProps {}

export interface Item<V> {
  key?: string;
  label: string;
  value: V;
}

// eslint-disable-next-line react/function-component-definition
function SelectInput<V>(props: Props<V>): JSX.Element {
  let {
    indicatorChar = Chalk.cyan('❯ '),
    initialIndex = 0,
    isFocused = true,
    itemComponent = ItemComponent,
    items = [],
    height,
    onHighlight,
    onSelect
  } = props;

  const [viewState, setViewState] = useState({
    viewIndex: 0,
    scrollOffset: initialIndex ? initialIndex - 1 : 0
  });

  const numItems = items.length;
  const hasViewLimit = !!height && numItems > height;

  const viewLimit = hasViewLimit
    ? Math.min(Number(height), numItems)
    : numItems;

  const moveUp = () => {
    const isFirstViewIndex = viewState.viewIndex === 0;
    const isScrolledTop = viewState.scrollOffset === 0;

    // Need to wrap around
    if (isFirstViewIndex && isScrolledTop) {
      setViewState(s => ({
        ...s,
        scrollOffset: numItems - viewLimit,
        viewIndex: viewLimit - 1
      }));
    } else if (isFirstViewIndex && !isScrolledTop) {
      setViewState(s => ({
        ...s,
        scrollOffset: s.scrollOffset - 1
      }));
    } else {
      setViewState(s => ({
        ...s,
        viewIndex: s.viewIndex - 1
      }));
    }
  };

  const moveDown = () => {
    const isLastViewIndex = viewState.viewIndex === viewLimit - 1;
    const isLastScrollableIndex =
      viewState.scrollOffset === numItems - viewLimit;

    // Need to wrap around
    if (isLastViewIndex && isLastScrollableIndex) {
      setViewState(s => ({
        ...s,
        scrollOffset: 0,
        viewIndex: 0
      }));
    } else if (isLastViewIndex && !isLastScrollableIndex) {
      setViewState(s => ({
        ...s,
        scrollOffset: s.scrollOffset + 1
      }));
    } else {
      setViewState(s => ({
        ...s,
        viewIndex: s.viewIndex + 1
      }));
    }
  };

  const getSelectedItem = () => {
    return items[viewState.scrollOffset + viewState.viewIndex];
  };

  const notifyHighlight = () => {
    if (typeof onHighlight === 'function') {
      onHighlight(getSelectedItem());
    }
  };

  useEffect(() => {
    notifyHighlight();
  }, [viewState]);

  // Detect keypress data
  useInput(
    useCallback(
      (input, key) => {
        if (input === 'k' || key.upArrow) {
          moveUp();
        }

        if (input === 'j' || key.downArrow) {
          moveDown();
        }

        if (key.return) {
          if (typeof onSelect === 'function') {
            onSelect(getSelectedItem());
          }
        }
      },
      [hasViewLimit, viewLimit, viewState, items]
    ),
    { isActive: isFocused }
  );

  // Limit items to that of the viewport
  const viewItemList = hasViewLimit
    ? arrayRotate(items, -viewState.scrollOffset).slice(0, viewLimit)
    : items;

  // Generate Components for viewable items
  const viewItemComponents = viewItemList.map((item, index) => {
    const isSelected = index === viewState.viewIndex;

    return React.createElement(itemComponent, {
      ...item,
      isSelected,
      key: item.key ?? String(item.value)
    });
  });

  return (
    <Box {...pick(props, PropagateProps)} flexDirection="row">
      <Box marginTop={viewState.viewIndex}>
        <Text>{indicatorChar}</Text>
      </Box>

      <Box flexDirection="column">{viewItemComponents}</Box>
    </Box>
  );
}

export default SelectInput;
