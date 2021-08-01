import path from 'path';

import ConfigStore from 'configstore';

import CliUI from './ui.mjs';
import Purger from './purger.mjs';

const __dirname = path.resolve();
const configFilePath = path.resolve(__dirname, '.config.json');

const Store = new ConfigStore('Store', {}, { configPath: configFilePath });

class App {
  resultInfo = {};

  init() {
    this.ui = new CliUI();

    this.addUiEvents();

    this.loadMenu();
  }

  addUiEvents() {
    this.ui.on('configure', this._configure);
    this.ui.on('saveConfig', this._saveConfig);
    this.ui.on('deleteall', this._startPurge); //lowercase on purpose
    this.ui.on('logout', this._logout);
    this.ui.on('exit', this._exit);
  }

  loadMenu() {
    const config = Store.get('cf');

    if (!config) {
      // Show Unconfigured Menu
      this.ui.unconfigured();
    } else {
      // Init Purger processor
      this.purger = new Purger(config);
      // Prime the Purger data 
      this.purger.setup();
      
      // Set Purger for UI update
      this.ui.purger = this.purger;

      // Show Configured Menu
      this.ui.configured();
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  _configure = () => {
    this.ui.startConfigure();
  };

  _saveConfig = config => {
    Store.set('cf', config);
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  _startPurge = async () => {
    await this.purger.start();
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  _logout = () => {
    Store.clear();
    this.ui.unconfigured();
  };

  _exit = () => {
    this.ui.exit();
    process.exit(0);
  };
}

const app = new App();
app.init();
