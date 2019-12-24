function sign_request(context, req) {
  return new Promise((resolve, reject) => {
    context.query = {
      params: req.params,
      body: req.payload,
      headers: req.headers
    };

    if (context.query.headers.hasOwnProperty('x-query-tracker-tags')) {
      const tags = context.query.headers['x-query-tracker-tags'].split(',');
      context.query.tags = [];
      tags.forEach((tag) => {
        context.query.tags.push(tag.trim());
      });
    }
    if (context.query.headers.hasOwnProperty('x-query-tracker-id')) {
      context.query.id = context.query.headers['x-query-tracker-id']
    }

    return resolve();
  });
}

module.exports = sign_request;
