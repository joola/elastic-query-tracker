const VERSION = require('./package.json').version;
const fs = require('fs');
const Https = require('https');
const Http = require('http');

const parse_request = require('./lib/parse_request');
const proxy_request = require('./lib/proxy_request');
const process_response = require('./lib/process_response');
const start_tracking = require('./lib/start_tracking');
const finish_tracking = require('./lib/finish_tracking');
const send_results = require('./lib/send_results');

let key;
let cert;

if (process.env.KEY_PATH) {
  key = fs.readFileSync(process.env.KEY_PATH);
} else {
  key = null;
}

if (process.env.CERT_PATH) {
  cert = fs.readFileSync(process.env.CERT_PATH);
} else {
  cert = null;
}

const PORT = process.env.PORT || 9200;
const serverOptions = {
  config: {
    port: PORT
  }
}
let useSSL = false;
if (key && cert) {
  useSSL = true;
  serverOptions.config.key = key;
  serverOptions.config.cert = cert;
}

async function handleRequest(req, res) {
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
}

console.log(`Starting Elastic Query Tracker v${VERSION} on port ${PORT}`);
let server;
if (useSSL) {
  server = Https.createServer(serverOptions.config, handleRequest);
} else {
  server = Http.createServer(handleRequest);
}
server.listen(serverOptions.config.port);
