import fetch from 'node-fetch';

class APIProxy {
  HTTP_VERBS = ['GET', 'DELETE', 'UPDATE', 'PUT', 'PATCH'];

  constructor(sourceObj) {
    return new Proxy(sourceObj, this);
  }

  get(target, key) {
    if (false === this.HTTP_VERBS.includes(key)) {
      throw new Error('Invalid Method!');
      return;
    }

    return this.applyProxy(target, key);
  }

  applyProxy(target, key) {
    return async function (data) {
      return fetch(target.url, {
        method: key,
        body: data ?? JSON.stringify(data),
        headers: target.headers
      });
    };
  }
}

export default class API {
  base_url = 'https://api.cloudflare.com/client/v4/user/firewall/access_rules/rules';

  pagination = {
    page: 1,
    per_page: 25
  };

  get url() {
    // Copy pagination data, and remove `totals`
    const queryString = Object.entries(this.pagination)
      .map(([key, value]) => key + '=' + value)
      .join('&');

    return `${this.base_url}?${queryString}`;
  }

  get headers() {
    return {
      'Content-Type': 'application/json',
      'X-Auth-Email': this.email,
      'X-Auth-Key': this.token
    };
  }

  constructor(email, token) {
    this.email = email;
    this.token = token;

    return new APIProxy(this);
  }
}
