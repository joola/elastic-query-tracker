# Elastic Query Tracker

Elastic query tracker is a light-weight proxy that provides insight into what searches are executed, how long searches run, the source of a search and more.

The proxy intercepts search requests and record them into Elasticsearch for further analysis and insight, we have created an easy to use dashboard to provide basic insight into your Elasticsearch search patterns.

[img]

## Data schema

```
{
  "user": {},
  "times": {
    "start": "2019-12-29T10: 23: 47.085Z",
    "end": "2019-12-29T10: 23: 47.097Z",
    "req_took_ms": 12,
    "elastic_took_ms": 5
  },
  "query": {
    "params": {},
    "body": null,
    "headers": {
      "host": "localhost:9205",
      "user-agent": "curl/7.61.0",
      "accept": "*/*",
      "x-opaque-id": "123",
      "content-type": "application/json",
      "x-query-tracker-id": "1234",
      "x-query-tracker-tags": "auth, login"
    },
    "tags": [
      "itay",
      "or"
    ],
    "id": "1234"
  },
  "is_search_request": true,
  "response": {
    "es_host": "http://localhost:9200"
    "took": 5,
    "timed_out": false,
    "shards": {
      "total": 1,
      "successful": 1,
      "skipped": 0,
      "failed": 0
    },
    "total": {
      "value": 3,
      "relation": "eq"
    }
  }
}
```

## Tagging your data

The proxy support custom HTTP headers for better segmentation of the data:

| Header       | Description | Example               |
|--------------|------------| -----------|
| x-query-tracker-tags         | Comma seperated list of tags            | auth,login
| x-query-tracker-id | A unique query identifier | query-1234

Here's an example curl:

```
$ curl -v -H"Content-Type: application/json" -H"X-query-tracker-id: query-1234" -H"X-query-tracker-tags: auth, login" localhost:9205/_search
```

## Running Elastic Query Tracker

Elastic query tracker is written in Javascript and executed with NodeJS.

```
$ node index.js
```

The proxy accepts the following environment variables:

| Environment var      | Default value         |
|--------------|-----------------------|
| PORT         | 9095                  |
| ELASTIC_HOST | http://localhost:9200 |


### Docker

We have an easy to deploy docker image with everything you need packed inside, just set the correct environment variables and run:

```
$ docker run --name elastic-query-tracker -e "PORT=9095" -e "ELASTIC_HOST=http://localhost:9200" joola/elastic-query-tracker:latest
```


## Contributing

Contributions are more than welcome, open a PR against master for a quick review.

## License

Elastic Query Tracker is licensed under the Apache License, Version 2.0. See LICENSE for the full license text.
