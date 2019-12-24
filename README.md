# Elastic Query Tracker

Elastic query tracker is a light-weight proxy that provides insight into what searches are executed, how long searches run, the source of a search and more.

The proxy intercepts search requests and record them into Elasticsearch for further analysis and insight, we have created an easy to use dashboard to provide basic insight into your Elasticsearch search patterns.

[img]



## Running Elastic Query Tracker

Elastic query tracker is written in Javascript and executed with NodeJS.

```
$ node index.js
```

The proxy accepts the following environment variables:

| env var      | default value         |
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
