import * as React from 'react';

import { Box, useFocusManager, useInput } from 'ink';
import { FormProps, FormSection } from 'ink-form';
import { useEffect, useMemo, useState } from 'react';

import { FormFieldRenderer } from 'ink-form/lib/FormFieldRenderer';
import { SubmitButton } from 'ink-form/lib/SubmitButton';
import { canSubmit } from 'ink-form/lib/canSubmit';

interface SimpleFormProps extends FormProps {
  autoFocus?: boolean;
}

export const SimpleForm: React.FC<SimpleFormProps> = props => {
  const isControlled = props.value !== undefined;
  const [value, setValue] = useState<object>(props.value ?? {});
  const [editingField, setEditingField] = useState<string>();
  const canSubmitForm = useMemo(
    () => canSubmit(props.form, value),
    [value, props.form]
  );
  const focusManager = useFocusManager();

  useEffect(() => {
    if (props.value) {
      setValue(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    focusManager.enableFocus();
    if (props.autoFocus) {
      focusManager.focusNext();
    }

    // Set initial values
    if (!isControlled) {
      setValueAndPropagate({
        ...value,
        ...props.form.sections
          .map(section =>
            section.fields
              .map(field =>
                field.initialValue !== undefined
                  ? { [field.name]: field.initialValue }
                  : {}
              )
              .reduce((obj1, obj2) => ({ ...obj1, ...obj2 }), {})
          )
          .reduce((obj1, obj2) => ({ ...obj1, ...obj2 }), {})
      });
    }
  }, []);

  const setValueAndPropagate = (value: object) => {
    setValue(value);
    props.onChange?.(value);
  };

  useInput(
    (_, key) => {
      if (key.upArrow) {
        focusManager.focusPrevious();
      } else if (key.downArrow) {
        focusManager.focusNext();
      }
    },
    { isActive: !editingField }
  );

  return (
    <Box width="100%" height="100%" flexDirection="column">
      {props.form.sections[0].fields.map(field => (
        <FormFieldRenderer
          field={field}
          key={field.name}
          form={props.form}
          value={value[field.name]}
          onChange={v => setValueAndPropagate({ ...value, [field.name]: v })}
          onSetEditingField={setEditingField}
          editingField={editingField}
          customManagers={props.customManagers}
        />
      ))}
      {!editingField && (
        <Box flexDirection="row-reverse">
          <SubmitButton
            canSubmit={canSubmitForm}
            onSubmit={() => props.onSubmit?.(value)}
          />
        </Box>
      )}
    </Box>
  );
};
