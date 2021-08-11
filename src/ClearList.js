import API from './api-cloudflare';
import { EventEmitter } from 'events';

const GENERIC_ERROR = 'firewallaccessrules.api.unknown_error';

export const ClearListEvents = {
  CLEARED_IP: 'CLEAR_LIST_EVENTS_CLEARED_IP',
  CLEARING_IP: 'CLEAR_LIST_EVENTS_CLEARING_IP',
  FETCHING_PAGE_DATA: 'CLEAR_LIST_EVENTS_FETCHING_PAGE_DATA',
  PAGE_COMPLETE: 'CLEAR_LIST_EVENTS_PAGE_COMPLETE',
  ERRORED: 'CLEAR_LIST_EVENTS_ERRORED'
};

class IPListIterator {
  api = null;
  list = [];
  idx = 0;

  constructor(api, list) {
    this.api = api;
    this.list = list;
  }

  async next() {
    return {
      value: {
        data: this.list[this.idx],
        response: await this.api.DELETE(this.list[this.idx])
      },
      done: ++this.idx === this.list.length
    };
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}

export default class ClearList extends EventEmitter {
  numIPs = 0;

  constructor({ email, token }) {
    super();

    if (!email || !token) {
      throw new Error(
        'You must supply both an Email and a Global API Key to run'
      );
    }

    this.email = email;
    this.token = token;

    this.api = new API(email, token);
  }

  // TODO: this is total_pages in data
  get _totalPages() {
    return this.numIPs / this.api.pagination.per_page;
  }

  async process() {
    // Determine if we have any more data to read...

    // No totals data stored, clearly we need to process!
    if (!this.numIPs || this._totalPages >= this.api.pagination.page) {
      await this._hydratePageData();
      await this._processPageData();
    }
  }

  async _hydratePageData() {
    this.emit(ClearListEvents.FETCHING_PAGE_DATA);

    console.log('Fetching next page data');

    try {
      const pageData = await this.api.GET();

      if (!pageData.success) {
        console.log(pageData);
        throw new Error(pageData.errors[0].message);
      }

      console.log('Got Page Data!');

      const {
        result,
        result_info: { total_count }
      } = pageData;

      if (!this._totalPages) {
        this.numIPs = total_count;
        console.log('Setting totals: ', total_count, ' -> ', this._totalPages);
      }

      this.list = new IPListIterator(this.api, result);
    } catch (e) {
      if (GENERIC_ERROR === e.message) {
        this.emit(ClearListEvents.ERRORED);
        throw new Error('Unknown Generic Error from API.');
      }

      console.log('error from api', JSON.stringify(e));

      throw new Error('Error from API: ' + e.message);
    }
  }

  async _processPageData() {
    console.log('Processing page of data: ' + this.api.pagination.page);

    for await (const listIter of this.list) {
      console.log('Processed: ', listIter.data);
    }

    console.log('Page completed.... Attempting next page!');

    this.api.pagination.page++;

    // Attempt to process another page!
    return this.process();
  }
}
