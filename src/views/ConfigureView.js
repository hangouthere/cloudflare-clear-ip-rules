import React, { useContext, useEffect } from 'react';

import { SimpleForm } from '_Shared/SimpleForm';

import { StoreContext } from '../state/StoreProvider';
import {
  AppActions,
  AppModes,
  AppStatuses
} from '../state/reducers/AppStateReducer';
import chalk from 'chalk';

const FORM_DATA = {
  title: 'Cloudflare Configuration',
  sections: [
    {
      title: 'API Access',
      description: 'Enter your API Credentials here',
      fields: [
        {
          key: 0,
          type: 'string',
          name: 'email',
          label: 'Enter Email',
          description: 'Enter the email you use to log into Cloudflare.',
          regex:
            /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/
        },

        {
          key: 1,
          type: 'string',
          name: 'token',
          label: 'Enter Global API Key',
          mask: '*',
          description:
            'Ensure you use your Global API Key!\nMore Info: ' +
            chalk.underline('https://url.nfgarmy.com/cfInfoGlobalKey')
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
        type: AppActions.SET_CONFIGURATION,
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

  return (
    <SimpleForm
      form={FORM_DATA}
      onSubmit={onSubmit}
      initialData={CloudflareConfig}
    />
  );
}
