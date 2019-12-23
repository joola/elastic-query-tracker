function process_response({
  context,
  req,
  res
}) {
  return new Promise((resolve, reject) => {
    res.writeHead(res.payload.statusCode, res.payload.headers);
    res.end(res.payload.body);
    return resolve({
      context,
      req,
      res
    });
  });
}

module.exports = process_response;
