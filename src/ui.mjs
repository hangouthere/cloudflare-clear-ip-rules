import { EventEmitter } from 'events';

import CLI from 'clui';
import CLC from 'cli-color';
import EmailValidator from 'email-validator';
import figlet from 'figlet';
import Inquirer from 'inquirer';

const { Clear, LineBuffer, Line, Gauge } = CLI;

const COLOR_STYLES_HEADER = [CLC.xterm(250).bgXterm(234)];
const COLOR_STYLES_BODY = [CLC.xterm(251)];

const CreateHeaderLine = txt =>
  new Line().column(txt, CLC.strip(txt).length, COLOR_STYLES_HEADER).fill(COLOR_STYLES_HEADER);

export default class UI extends EventEmitter {
  headerLinesCache = null;

  get headerLines() {
    if (this.headerLinesCache) {
      return this.headerLinesCache;
    }

    this.headerLinesCache = new LineBuffer({
      height: 7
    });

    const lines = figlet.textSync('Cloudflare Clear', { font: 'Ogre' }).split('\n').slice(0, -1).map(CreateHeaderLine);

    lines.push(CreateHeaderLine('  Made with ' + CLC.xterm(9)('♥') + ' by ' + CLC.xterm(202)('nfgCodex')));

    lines.forEach(this.headerLinesCache.addLine);

    return this.headerLinesCache;
  }

  dumpHeader() {
    Clear(true);

    this.headerLines.fill(new Line().fill(COLOR_STYLES_BODY)).output();
  }

  exit() {
    this.dumpHeader();
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async unconfigured() {
    this.dumpHeader();

    const mainMenu = await Inquirer.prompt([
      {
        type: 'rawlist',
        name: 'selected',
        message: 'Main Menu',
        prefix: '📃',
        suffix: ':',
        choices: ['Configure', new Inquirer.Separator(), 'Exit']
      }
    ]);

    this.emit(mainMenu.selected.toLowerCase());
  }

  async startConfigure() {
    this.dumpHeader();

    new Line().column('Configuration:', 20, [CLC.cyan]).fill().output();

    const config = await Inquirer.prompt([
      {
        type: 'input',
        name: 'email',
        message: 'Email Address',
        prefix: '📧',
        suffix: ':',
        validate(value) {
          const pass = EmailValidator.validate(value);
          return pass ? true : 'Please enter a valid email address, try again...';
        }
      },

      {
        type: 'password',
        name: 'token',
        message: 'API Token',
        prefix: '🔑',
        suffix: ':',
        validate(value) {
          return value.trim().length >= 28 ? true : 'Entered token is not the correct length...';
        }
      }
    ]);

    this.emit('saveConfig', config);

    this.configured();
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async configured() {
    this.dumpHeader();

    this.updatePurgeData(true);

    const mainMenu = await Inquirer.prompt([
      {
        type: 'rawlist',
        name: 'selected',
        message: 'Main Menu',
        prefix: '📃',
        suffix: ':',
        choices: [{ name: 'Delete All IP Rules', value: 'deleteAll' }, 'Logout', new Inquirer.Separator(), 'Exit']
      }
    ]);

    this.emit(mainMenu.selected.toLowerCase());
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  set purger(val) {
    this._purger = val;

    // this.updatePurgeData(true);
  }

  trackPurger = async purger => {
    setTimeout(this.updatePurgeData, 10);
  };

  updatePurgeData = async onlyOnce => {
    const numProcessed = this._purger.numProcessed;
    const total_count = this._purger.resultInfo?.total_count ?? 1;

    // Number of IPs to Process
    


    new LineBuffer({
      x: 4,
      y: 7,
      height: 2
    })
      .addLine(
        new Line()
          .column('Num IPs: ', 9, [CLC.yellowBright])
          .column(Gauge(numProcessed, total_count, 20, total_count * 0.95, `${numProcessed} of ${total_count}`))
          .fill()
      )
      .fill(new Line().column(' ', 10, COLOR_STYLES_BODY))
      .output();

    if (!onlyOnce) {
      setTimeout(this.updatePurgeData, 10);
    }
  };
}
