import { Box, Transform } from 'ink';

import React from 'react';
import TextInput from 'ink-text-input';

// Basically a copoy of StringFormFieldManager, but slightly modified to expect `customError`

export class CustomErrorFormFieldManager {
  type = 'customError';

  renderField = props => (
    <Box borderStyle={'round'} width="100%">
      <TextInput
        value={props.value ?? ''}
        onChange={value => {
          props.onChange(value);

          if (props.field.regex && !props.field.regex.test(value)) {
            props.onError(props.field.customError);
          } else {
            props.onClearError();
          }
        }}
        placeholder={props.field.placeholder}
        onSubmit={() => props.onSetEditingField(undefined)}
        mask={props.field.mask}
      />
    </Box>
  );

  renderValue = props => (
    <Transform
      transform={
        props.value !== undefined && props.field.mask
          ? text =>
              text
                .split('')
                .map(char => '*')
                .join('')
          : text => text
      }
    >
      {props.value}
    </Transform>
  );
}
