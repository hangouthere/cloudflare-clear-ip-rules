#!/usr/bin/env node
'use strict';

import chalk from 'chalk';
import { render } from 'ink';
import meow from 'meow';
import React from 'react';

import ui from './src/App';
import ClearList from './src/ClearList';
import { BuildConfig } from './src/Config';

// Detect if we're in a node runtime (vs a binary)
const nodeRuntimes = ['node', 'npx', 'npm'];
const isNodeRuntime = nodeRuntimes.some(rt => process.argv[0].includes(rt));

// Establish the command name based on runtime
const cmdName = isNodeRuntime
  ? `${process.argv[0]} ${process.argv[1]}`
  : process.argv[0];

const cli = meow(`
    Usage:
        $ ${cmdName}

    Options:
        --token 1234567890abcdefgh1234567890 - Ensure you use your Global API Key!
                                               More Info: ${chalk.reset.blue.underline(
                                                 'https://url.nfgarmy.com/cfInfoGlobalKey'
                                               )}
        --email user@blah.com                - Use the email you use to log into Cloudflare
        --clear                              - Instantly process the Clear List.
                                               Assumes token/email are configured, or passed as options.

    Examples
        $ ${cmdName} --token=1234567890abcdefgh1234567890 --email=user@blah.com
        $ ${cmdName} --clear
`);

const Config = BuildConfig(cli.flags);

if (cli.flags.clear) {
  // Kick off Clear processing
  const processor = new ClearList(Config);
  processor.process();
} else {
  // Render the UI
  render(React.createElement(ui, Config));
}
