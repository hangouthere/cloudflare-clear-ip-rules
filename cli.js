#!/usr/bin/env node
"use strict";

import React from "react";
import meow from "meow";
import { render } from "ink";

import ui from "./src/App";

// const cli = meow(`
// 	Usage
// 	  $ npx ./cli.js

// 	Options
// 		--name  Your name

// 	Examples
// 	  $ npx ./cli.js --name=Jane
// 	  Hello, Jane
// `);

const cli = meow();

render(React.createElement(ui, cli.flags));
