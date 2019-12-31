function sign_request(context, req) {
  return new Promise((resolve, reject) => {
    context.query = { body: JSON.stringify(req.payload) };
    context.request.headers = req.headers;
    context.request.params = req.params;

    if (context.request.headers.hasOwnProperty('x-query-tracker-tags')) {
      const tags = context.request.headers['x-query-tracker-tags'].split(',');
      context.query.tags = [];
      tags.forEach((tag) => {
        context.query.tags.push(tag.trim());
      });
    }
    if (context.request.headers.hasOwnProperty('x-query-tracker-id')) {
      context.query.id = context.request.headers['x-query-tracker-id']
    }

    return resolve();
  });
}

module.exports = sign_request;
