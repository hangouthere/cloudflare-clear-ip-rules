import {
  AppActions,
  AppModes,
  AppStatuses
} from '../state/reducers/AppStateReducer';
import React, { useContext, useEffect } from 'react';

import { CloudflareConfigActions } from '../state/reducers/CloudflareConfigReducer';
import { CustomErrorFormFieldManager } from '../_shared/EmailFormFieldManager';
import { SimpleForm } from '_Shared/SimpleForm';
import { StoreContext } from '../state/StoreProvider';
import chalk from 'chalk';

const CustomManagers = [new CustomErrorFormFieldManager()];

const FORM_DATA = {
  title: 'Cloudflare Configuration',
  sections: [
    {
      fields: [
        {
          type: 'customError',
          name: 'email',
          label: 'Enter Email',
          description: 'Enter the email you use to log into Cloudflare.',
          customError: 'Please enter a valid Email Address',
          regex:
            /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
        },

        {
          type: 'customError',
          name: 'token',
          label: 'Enter Global API Key',
          mask: '*',
          description:
            chalk.reset.yellow('Ensure you use your Global API Key!') +
            '\nMore Info: ' +
            chalk.reset.blue.underline(
              'https://url.nfgarmy.com/cfInfoGlobalKey'
            ),
          customError:
            'Please use only Alpha-Numeric input, and enough characters',
          regex: /^[0-9A-Za-z]{10,}$/
        }
      ]
    }
  ]
};

export default function ConfigureView() {
  const {
    dispatch,
    state: { CloudflareConfig }
  } = useContext(StoreContext);

  useEffect(() => {
    dispatch({
      type: AppActions.SET_STATUS_MSG,
      payload: {
        status: AppStatuses.CONFIGURING
      }
    });
  }, []);

  const onSubmit = formData => {
    const { email, token } = formData;

    // Yay, we're configured!
    if (email && token) {
      dispatch({
        type: CloudflareConfigActions.SET_CONFIG,
        payload: formData
      });
    } else {
      // Not properly configured, set error!
      dispatch({
        type: AppActions.SET_STATUS_MSG,
        payload: {
          status: AppStatuses.ERRORED,
          error: 'Incomplete Configuration, you will not be able to proceed!'
        }
      });
    }

    // Move back to Menu
    dispatch({
      type: AppActions.SET_MODE,
      payload: AppModes.MENU
    });
  };

  FORM_DATA.sections[0].fields[0].initialValue = CloudflareConfig.email;
  FORM_DATA.sections[0].fields[1].initialValue = CloudflareConfig.token;

  return (
    <SimpleForm
      form={FORM_DATA}
      onSubmit={onSubmit}
      customManagers={CustomManagers}
      autoFocus={true}
    />
  );
}
