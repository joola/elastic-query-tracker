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

function proxy_request(req, res) {

  // all attributes are optional
  const options = {
    baseUrl: fetch_host(process.env.ELASTIC_HOST || 'http://localhost:9200'),
    //payload: readableStream || 'foo=bar' || new Buffer('foo=bar'),
    headers: { /* http headers */ },
    redirects: 3,
    beforeRedirect: (redirectMethod, statusCode, location, resHeaders, redirectOptions, next) => next(),
    redirected: function (statusCode, location, req) { },
    //maxBytes: 10485760000, // 1 MB, default: unlimited
    rejectUnauthorized: false,
    downstreamRes: null,
    keepAlive: false,
    //secureProtocol: 'SSLv3_method', // The SSL method to use
    //ciphers: 'DES-CBC3-SHA' // The TLS ciphers to support
  };

  //console.log('proxy_request');
  return new Promise((resolve, reject) => {
    const requestOptions = _.extend(options, {
      headers: req.headers,
      payload: req.payload || null
    });
    //console.log(req.payload);
    delete requestOptions.headers['content-length'];
    return wreck.request(req.method.toLowerCase(), req.url, requestOptions)
      .then((response) => {
        return Wreck.read(response)
          .then((body) => {
            res.payload = {
              statusCode: response.statusCode,
              headers: response.headers,
              body
            };
            return resolve();
          })
          .catch((err) => {
            console.log(`Proxy request failed [read]: ${err.message}`);
            return reject(err);
          });
      })
      .catch((err) => {
        console.log(`Proxy request failed [request]: ${err.message}`);
        return reject(err);
      })
  })
}

module.exports = proxy_request;
