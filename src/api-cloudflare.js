import fetch from 'node-fetch';

class APIProxy {
  HTTP_VERBS = ['GET', 'DELETE', 'UPDATE', 'PUT', 'PATCH'];

  constructor(sourceObj) {
    return new Proxy(sourceObj, this);
  }

  get(target, key) {
    if (target.hasOwnProperty(key)) {
      return target[key];
    }

    if (false === this.HTTP_VERBS.includes(key)) {
      throw new Error('Invalid HTTP Method: ', key);
    }

    return this.applyProxy(target, key);
  }

  applyProxy(target, key) {
    return async function (data) {
      let url = target.base_url;

      // If we're doing a side effect HTTP Verb (ie, non-GET),
      // we want to tack on the identifier for the resource
      if ('GET' !== key) {
        url += `/${data.id}`;
      }

      return (
        fetch(`${url}?${target.queryString}`, {
          method: key,
          body: data ?? JSON.stringify(data),
          headers: target.headers
        })
          // .then(r => {
          //   return r.text();
          // })
          .then(r => r.json())
          .catch(e => {
            debugger;
            console.log(e);
          })
      );
    };
  }
}

export default class API {
  base_url =
    'https://api.cloudflare.com/client/v4/user/firewall/access_rules/rules';

  pagination = {
    page: 1,
    per_page: 1
  };

  get queryString() {
    // Build Query string for Pagination
    return Object.entries(this.pagination)
      .map(([key, value]) => key + '=' + value)
      .join('&');
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
