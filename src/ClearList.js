import API from './api-cloudflare';
import { EventEmitter } from 'events';

const GENERIC_ERROR = 'firewallaccessrules.api.unknown_error';

export const ClearListEvents = {
  IP_CLEARED: 'CLEAR_LIST_EVENTS_IP_CLEARED',
  ERRORED: 'CLEAR_LIST_EVENTS_ERRORED',
  PAGE_FETCH: 'CLEAR_LIST_EVENTS_FETCHING_PAGE_DATA',
  PAGE_COMPLETED: 'CLEAR_LIST_EVENTS_PAGE_COMPLETED',
  PAGE_STARTING: 'CLEAR_LIST_EVENTS_PAGE_STARTING',
  TOTALS_UPDATED: 'CLEAR_LIST_EVENTS_TOTALS_UPDATED',
  PROCESS_COMPLETED: 'CLEAR_LIST_EVENTS_PROCESS_COMPLETED'
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
  totalPages = 0;

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

  async process() {
    // Determines if we have any more data to read...

    // No totals data stored, clearly we need to process!
    if (!this.numIPs || this.api.pagination.page < this.totalPages) {
      await this._hydratePageData();
      await this._processPageData();
    } else if (this.numIPs) {
      // We had IPs, but we've reached our page limit
      this.emit(ClearListEvents.PROCESS_COMPLETED);
    }
  }

  async _hydratePageData() {
    this.emit(ClearListEvents.PAGE_FETCH, this.api.pagination.page);

    try {
      const pageData = await this.api.GET();

      // No success! Go to our Catch!
      if (!pageData.success) {
        throw new Error(pageData.errors[0].message);
      }

      const { result } = pageData;

      // Update totals for ClearList bounds
      if (!this.totalPages) {
        const {
          result_info: { total_count, total_pages }
        } = pageData;

        this.numIPs = total_count;
        this.totalPages = total_pages;

        this.emit(ClearListEvents.TOTALS_UPDATED, {
          numIPs: total_count,
          totalPages: total_pages
        });
      }

      // Establish Iterator for later
      this.list = new IPListIterator(this.api, result);
    } catch (e) {
      if (GENERIC_ERROR === e.message) {
        this.emit(ClearListEvents.ERRORED, e);
        throw new Error('Unknown Generic Error from API.');
      }

      this.emit(ClearListEvents.ERRORED, e);

      throw new Error('Error from API: ' + e.message);
    }
  }

  async _processPageData() {
    this.emit(ClearListEvents.PAGE_STARTING, this.api.pagination.page);

    for await (const listIter of this.list) {
      // FIXME: Check for error!
      this.emit(ClearListEvents.IP_CLEARED, listIter.data);
    }

    this.emit(ClearListEvents.PAGE_COMPLETED, this.api.pagination.page);

    this.api.pagination.page++;

    // Attempt to process another page!
    return this.process();
  }
}
