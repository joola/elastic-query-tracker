const VERSION = require('./package.json').version;
const fs = require('fs');
const Https = require('https');
const Http = require('http');

const handle_request = require('./lib/handle_request');
let publisher = null;

async function initOutputStream() {
  publisher = require('./lib/send_results_es');
  await publisher.init()

  handle_request.init(publisher);
}

function initServer() {
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

  const PORT = process.env.PORT || 9205;
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
  let server;
  if (useSSL) {
    server = Https.createServer(serverOptions.config, handle_request.handle);
  } else {
    server = Http.createServer(handle_request.handle);
  }
  console.log(`Starting Elastic Query Tracker v${VERSION} on port ${PORT}`);
  server.listen(serverOptions.config.port);
}

//Let's setup the publisher

async function init() {
  try {
    await initOutputStream();
  }
  catch (ex) {
    console.error('Failed to init output stream.', ex);
  }

  //Let's start listening
  try {
    initServer();
  }
  catch (ex) {
    console.error('Failed to start service.', ex)
  }
}
init();