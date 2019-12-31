const url = require('url');
const qs = require('qs');

function parse_request(context, req) {
  return new Promise((resolve, reject) => {
    const parsed = url.parse(req.url);
    req.params = qs.parse(parsed.query);

    let endpoint = parsed.pathname.split('/');
    let path = '';
    context.is_search_request = false;
    context.request.url = req.url;
    endpoint.forEach((ep, i) => {
      if (ep === '_search' || ep === '_msearch') {
        for (var j = 0; j < i; j++) {
          path = endpoint[j];
        }
        context.request.is_search = true;
        context.request.index_pattern = (path === '' ? '*' : path)
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
