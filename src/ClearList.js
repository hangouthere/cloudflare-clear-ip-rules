import { EventEmitter } from 'events';
import API from './api-cloudflare';

export const ClearListEvents = {
  CLEARED_IP: 'CLEARED_IP',
  CLEARING_IP: 'CLEARING_IP',
  FETCHING_PAGE_DATA: 'FETCHING_PAGE_DATA',
  PAGE_COMPLETE: 'PAGE_COMPLETE'
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

    const pageData = await this.api.GET();

    console.log(pageData);

    const {
      result,
      result_info: { total_count }
    } = pageData;

    if (!this._totalPages) {
      this.numIPs = total_count;
      console.log('Setting totals: ', total_count, ' -> ', this._totalPages);
    }

    this.list = new IPListIterator(this.api, result);
  }

  async _processPageData() {
    for await (const listIter of this.list) {
      console.log('Processed: ', listIter.data);
    }

    console.log('Page completed.... Attempting next page!');

    this.api.pagination.page++;

    // Attempt to process another page!
    return await this.process();
  }
}
