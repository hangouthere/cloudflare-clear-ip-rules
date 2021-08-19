import ClearList, { ClearListEvents } from './ClearList';

export class ViewRunner {
  totals = { curr: 0, totalPages: 'Unknown' };

  constructor({ config, setLogEntries, dispatch }) {
    this.config = config;
    this.setLogEntries = setLogEntries;
    this.dispatch = dispatch;
  }

  run() {
    // Kick off Clear processing
    const processor = new ClearList(this.config);

    this.addEventListeners(processor);

    processor.process();

    return processor;
  }

  addEventListeners(processor) {
    processor.on(ClearListEvents.ERRORED, this._onErrored);
    processor.on(ClearListEvents.IP_CLEARED, this._onIPCleared);
    processor.on(ClearListEvents.PAGE_FETCH, this._onPageFecth);
    processor.on(ClearListEvents.PAGE_COMPLETED, this._onPageCompleted);
    processor.on(ClearListEvents.PAGE_STARTING, this._onPageStart);
    processor.on(ClearListEvents.TOTALS_UPDATED, this._onTotalsUpdated);
    processor.on(ClearListEvents.PROCESS_COMPLETED, this._onProcessCompleted);
  }

  removeEventListeners(processor) {
    processor.off(ClearListEvents.ERRORED, this._onErrored);
    processor.off(ClearListEvents.IP_CLEARED, this._onIPCleared);
    processor.off(ClearListEvents.PAGE_FETCH, this._onPageFecth);
    processor.off(ClearListEvents.PAGE_COMPLETED, this._onPageCompleted);
    processor.off(ClearListEvents.PAGE_STARTING, this._onPageStart);
    processor.off(ClearListEvents.TOTALS_UPDATED, this._onTotalsUpdated);
    processor.off(ClearListEvents.PROCESS_COMPLETED, this._onProcessCompleted);
  }

  _onErrored = err => {
    console.log(chalk.bgRed.white('Error: ' + JSON.stringify(err)));
  };

  /* 
  {
    id: 'asdf',
    paused: false,
    modified_on: '2021-08-19T',
    allowed_modes: [ 'whitelist', 'block', 'challenge', 'js_challenge' ],
    mode: 'block',
    notes: 'Some Note',
    configuration: { target: 'ip4', value: '0.0.0.0' },
    scope: {
      id: 'fdsa',
      email: 'user@domain.com',
      type: 'user'
    },
    created_on: '2021-08-19T'
  } 
  */
  _onIPCleared = ({ configuration: { target: proto, value: ipAddress } }) => {
    this.totals.curr++;

    if (this.isQuiet) return;

    const { curr, numIPs } = this.totals;

    console.log(
      chalk.green('✔') +
        ` Cleaned ${proto.toUpperCase()} (${curr} of ${numIPs}): ${ipAddress}`
    );
  };

  _onPageFecth = pageNum => {
    if (this.isQuiet) return;

    console.log(
      chalk.bgYellow.white.dim('Fetching Page:') +
        ` ${pageNum} of ${this.totals.totalPages}`
    );
  };

  _onPageCompleted = pageNum => {
    if (this.isQuiet) return;

    console.log(
      chalk.green('Page Completed:') +
        ` ${pageNum} of ${this.totals.totalPages}`
    );
  };

  _onPageStart = pageNum => {
    if (this.isQuiet) return;

    console.log(
      chalk.yellow('Processing Page:') +
        ` ${pageNum} of ${this.totals.totalPages}`
    );
  };

  _onTotalsUpdated = totals => {
    this.totals = {
      ...this.totals,
      ...totals
    };

    const { numIPs, totalPages } = totals;
    console.log(
      chalk.bgGreen.white('List Totals >') +
        ` Number of IPs: ${numIPs}, Number of Pages: ${totalPages}`
    );
  };

  _onProcessCompleted = () => {
    console.log(chalk.bgGreen.white('Complete!'));
  };
}
