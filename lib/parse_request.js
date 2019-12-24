const url = require('url');
const qs = require('qs');

function parse_request(context, req) {
  return new Promise((resolve, reject) => {
    const parsed = url.parse(req.url);
    req.params = qs.parse(parsed.query);

    let endpoint = parsed.pathname.split('/');
    context.is_search_request = false;
    endpoint.forEach((ep) => {
      if (ep === '_search' || ep === '_msearch') {
        context.is_search_request = true;
      }
    });

    let body = '';
    req.on('readable', function () {
      const chunk = req.read();
      if (chunk) {
        body += chunk;
      }
    });
    req.on('end', function () {
      if (body && body.length > 0) {
        try {
          req.payload = JSON.parse(body);
        } catch (ex) {
          req.payload = body;
        }
      } else {
        req.payload = null;
      }
      return resolve();
    });
    req.on('error', function (err) {
      return reject(err);
    });
  });
}

module.exports = parse_request;
