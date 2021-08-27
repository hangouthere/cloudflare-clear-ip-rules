import ClearList, { ClearListEvents } from '../ClearList';

import chalk from 'chalk';

export default class ViewRunner {
  addLogEntry = null;
  config = null;
  setTotals = null;
  updateCurrent = null;
  totals = { curr: 0, totalPages: 'Unknown' };

  constructor({ config, addLogEntry, setTotals, updateCurrent }) {
    this.addLogEntry = addLogEntry;
    this.config = config;
    this.setTotals = setTotals;
    this.updateCurrent = updateCurrent;
  }

  async run() {
    // Kick off Clear processing
    const processor = new ClearList(this.config);

    this.addEventListeners(processor);

    try {
      await processor.process();
    } catch (e) {
      // no-op, it should output on screen
    }

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
    this.addLogEntry(chalk.bgRed.white(`Error: ${err.message}`));
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

    const { curr, numIPs } = this.totals;

    this.updateCurrent(curr);

    this.addLogEntry(
      chalk.green('✔') +
        ` Cleaned ${proto.toUpperCase()} (${curr} of ${numIPs}): ${ipAddress}`
    );
  };

  _onPageFecth = pageNum => {
    this.addLogEntry(
      chalk.bgYellow.white.dim('Fetching Page:') +
        ` ${pageNum} of ${this.totals.totalPages}`
    );
  };

  _onPageCompleted = pageNum => {
    this.addLogEntry(
      chalk.green('Page Completed:') +
        ` ${pageNum} of ${this.totals.totalPages}`
    );
  };

  _onPageStart = pageNum => {
    this.addLogEntry(
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

    this.addLogEntry(
      chalk.bgGreen.white('List Totals >') +
        ` Number of IPs: ${numIPs}, Number of Pages: ${totalPages}`
    );

    this.setTotals({
      numIPs,
      totalPages
    });
  };

  _onProcessCompleted = () => {
    this.addLogEntry(chalk.bgGreen.white('Complete!'));
  };
}
