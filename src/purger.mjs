import CloudflareAPI from './api-cloudflare.mjs';

export default class Purger {
  api = null;
  currentPage = null;
  numProcessed = 0;
  resultInfo = null;

  constructor(config) {
    this.api = new CloudflareAPI(config.email, config.token);
  }

  async setup() {
    await this.loadFirstPage();
  }

  start() {
    setTimeout(this._purgeCurrent, 1000);
  }

  async loadFirstPage() {
    const res = await this.api.GET();
    const json = await res.json();

    if (!json.success) {
      return console.log(json.errors[0].message);
    }

    // console.log(json);

    this.resultInfo = json.result_info;
    this.currentPage = json.results;
    this.numProcessed = 0;
  }

  _purgeCurrent = () => {
    this.numProcessed++;

    setTimeout(this._purgeCurrent, 1000);
  }
}
