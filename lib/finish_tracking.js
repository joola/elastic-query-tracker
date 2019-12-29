function sign_request(context, res) {
  return new Promise((resolve, reject) => {
    if (res.statusCode >= 400) {
      return resolve();
    }

    context.times.end = new Date();
    context.times.req_took_ms = context.times.end - context.times.start;
    const body = JSON.parse(res.payload.body);
    const target = res.payload.target;
    context.times.elastic_took_ms = body.took;
    //context.query.times = context.times;

    context.response = {
      es_host: target,
      took: body.took,
      timed_out: body.timed_out,
      shards: body._shards,
      total: body.hits ? body.hits.total : undefined
    }

    return resolve();
  });
}

module.exports = sign_request;
