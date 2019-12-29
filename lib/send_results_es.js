const _ = require('lodash');
const Wreck = require('wreck');
const Https = require('https');
const Http = require('http');

const fetch_host = require('./fetch_host');

const wreck = Wreck.defaults({
  headers: {

  },
  agents: {
    https: new Https.Agent({}),
    http: new Http.Agent({
      keepAlive: false
    }),
    httpsAllowUnauthorized: new Https.Agent({
      rejectUnauthorized: false
    })
  }
});

function init() {
  return new Promise((resolve, reject) => {
    return resolve();
  });
}

function publish(event) {
  return new Promise((resolve, reject) => {
    const options = {
      baseUrl: fetch_host(process.env.ELASTIC_HOST || 'http://localhost:9200'),
      headers: { /* http headers */ },
      redirects: 3,
      beforeRedirect: (redirectMethod, statusCode, location, resHeaders, redirectOptions, next) => next(),
      redirected: function (statusCode, location, req) { },

      rejectUnauthorized: false,
      downstreamRes: null,
      keepAlive: false,
    };

    return new Promise((resolve, reject) => {
      const requestOptions = _.extend(options, {
        payload: event
      });
      delete requestOptions.headers['content-length'];
      return wreck.request('POST', `/.elastic-query-tracker/_doc`, requestOptions)
        .then((response) => {
          return Wreck.read(response)
            .then((body) => {
              return resolve();
            })
            .catch((err) => {
              console.log(`Proxy request failed [read]: ${err.message}`);
              return reject(err);
            });
        })
        .catch((err) => {
          console.log(`Failed to save event: ${err.message}`);
          return reject(err);
        });
    });
  });
}

module.exports = {
  init,
  publish
};
