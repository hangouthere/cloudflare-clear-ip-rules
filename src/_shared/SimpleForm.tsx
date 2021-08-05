import { Box, useFocusManager, useInput } from 'ink';
import { FormProps } from 'ink-form';
import { canSubmit } from 'ink-form/lib/canSubmit';
import { FormFieldRenderer } from 'ink-form/lib/FormFieldRenderer';
import { SubmitButton } from 'ink-form/lib/SubmitButton';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';

export const SimpleForm: React.FC<FormProps> = props => {
  const isControlled = props.value !== undefined;
  const [currentTab, setCurrentTab] = useState(0);
  const [value, setValue] = useState<object>(props.value ?? {});
  const [editingField, setEditingField] = useState<string>();
  const canSubmitForm = useMemo(
    () => canSubmit(props.form, value),
    [value, props.form]
  );
  const focusManager = useFocusManager();

  useEffect(() => {
    focusManager.enableFocus();
  }, []);

  useEffect(() => {
    if (props.value) {
      setValue(props.value);
    }
  }, [props.value]);

  useEffect(() => {
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
    (input, key) => {
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
      {currentTab > props.form.sections.length - 1
        ? null
        : props.form.sections[currentTab].fields.map(field => (
            <FormFieldRenderer
              field={field}
              key={field.name}
              form={props.form}
              value={value[field.name]}
              onChange={v =>
                setValueAndPropagate({ ...value, [field.name]: v })
              }
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
