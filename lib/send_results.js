function sign_request({
  context,
  req,
  res
}) {
  return new Promise((resolve, reject) => {
    console.log(require('util').inspect(context.query))
    return resolve({
      context,
      req,
      res
    });
  });
}

module.exports = sign_request;
