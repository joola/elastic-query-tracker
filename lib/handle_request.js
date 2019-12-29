const parse_request = require('./parse_request');
const proxy_request = require('./proxy_request');
const process_response = require('./process_response');
const start_tracking = require('./start_tracking');
const finish_tracking = require('./finish_tracking');

let _publisher;

function init (publisher) {
  _publisher = publisher;

}
async function handle(req, res) {
  req.socket.setTimeout(0);
  req.credentials = {};
  let context = {
    user: {},
    times: {
      start: new Date()
    },
    query: {}
  };

  res.setHeader('Connection', 'close');
  await parse_request(context, req);
  if (context.is_search_request !== true) {
    try {
      await proxy_request(req, res)
      await process_response(res)
    }
    catch (err) {
      console.log('General error', req.method, req.url, err.message || err.toString(), err.stack);
      if (err.isBoom) {
        res.writeHead(err.output.statusCode, err.output.headers)
        res.end(err.output.message)
      }
      else {
        res.writeHead(500);
        res.end('General exception: ' + err);
      }
    }
  }
  else {
    try {
      await start_tracking(context, req);
      await proxy_request(req, res);
      await process_response(res);
      await finish_tracking(context, res);
      await _publisher.publish(context);
    }
    catch (err) {
      console.error('General error', req.method, req.url, err.message || err.toString(), err.stack);
      if (err.isBoom) {
        res.writeHead(err.output.statusCode, err.output.headers)
        res.end(err.output.message)
      }
      else {
        res.writeHead(500);
        res.end('General exception: ' + err);
      }
    }
  }
}


module.exports = {
  init,
  handle
};
