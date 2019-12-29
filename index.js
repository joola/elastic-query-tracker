const VERSION = require('./package.json').version;
const fs = require('fs');
const Https = require('https');
const Http = require('http');

const handle_request = require('./lib/handle_request');
let publisher = null;

console.log(`Starting Elastic Query Tracker v${VERSION} on port ${PORT}`);

async function initOutputStream() {
  const KAFKA_URL = process.env.KAFKA_URL;
  const KAFKA_TOPIC = process.env.KAFKA_TOPIC;

  const REDIS_HOST = process.env.REDIS_HOST;
  const REDIS_PORT = process.env.REDIS_PORT || 6379;
  const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

  if (KAFKA_URL && KAFKA_TOPIC) {
    publisher = require('./lib/send_results_kafka');
    await publisher.init(KAFKA_URL, KAFKA_TOPIC)
  }
  else if (REDIS_HOST && REDIS_PORT) {
    publisher = require('./lib/send_results_redis');
    await publisher.init(REDIS_HOST, REDIS_PORT, REDIS_PASSWORD)
  }
  else {
    publisher = require('./lib/send_results_es');
    await publisher.init()
  }
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
    publisher,
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
    server = Https.createServer(serverOptions.config, handle_request);
  } else {
    server = Http.createServer(handle_request);
  }
  server.listen(serverOptions.config.port);
}

//Let's setup the publisher
try {
  initOutputStream();
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