const parse_request = require('./lib/parse_request');
const proxy_request = require('./lib/proxy_request');
const process_response = require('./lib/process_response');
const start_tracking = require('./lib/start_tracking');
const finish_tracking = require('./lib/finish_tracking');
const send_results = require('./lib/send_results');

async function handle_request(req, res) {
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
      await send_results(context);
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


module.exports = handle_request;
