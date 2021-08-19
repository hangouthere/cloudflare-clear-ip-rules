#!/usr/bin/env node
'use strict';

import { BuildConfig } from './src/Config';
import { CLIRunner } from './src/CliRunner';
import React from 'react';
import chalk from 'chalk';
import meow from 'meow';
import { render } from 'ink';
import ui from './src/App';

// Detect if we're in a node runtime (vs a binary)
const nodeRuntimes = ['node', 'npx', 'npm'];
const isNodeRuntime = nodeRuntimes.some(runtimeName =>
  process.argv[0].includes(runtimeName)
);

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
        --clear, --clean, --ci               - Instantly process the Clear List.
                                               Assumes token/email are configured, or passed as options.
        --quiet, -q                          - Only valid when used with ${chalk.bgGrey(
          'clear/clean/ci'
        )} to reduce, extraneous output. 

    Examples
        $ ${cmdName} --token=1234567890abcdefgh1234567890 --email=user@blah.com
        $ ${cmdName} --clear
`);

const Config = BuildConfig(cli.flags);

if (cli.flags.clear || cli.flags.clean || cli.flags.ci) {
  const runner = new CLIRunner({ ...Config, ...cli.flags });
  runner.run();
} else {
  // Render the UI
  render(React.createElement(ui, Config));
}
