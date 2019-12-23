function sign_request({
  context,
  req,
  res
}) {
  return new Promise((resolve, reject) => {
    context.times.end = new Date();
    context.times.req_took_ms = context.times.end - context.times.start;
    const body = JSON.parse(res.payload.body);
    context.times.elastic_took_ms = body.took;
    context.query.times = context.times;

    
    context.query.response={
      took: body.took,
      timed_out: body.timed_out,
      shards: body._shards,
      total: body.hits.total
    }

    return resolve({
      context,
      req,
      res
    });
  });
}

module.exports = sign_request;
