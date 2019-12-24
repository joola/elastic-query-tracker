function process_response(res) {
  return new Promise((resolve, reject) => {
    res.writeHead(res.payload.statusCode, res.payload.headers);
    res.end(res.payload.body);
    return resolve();
  });
}

module.exports = process_response;
