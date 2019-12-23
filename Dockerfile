FROM node:12-alpine

LABEL \
  name="elastic-query-tracker" \
  version="0.1.1" \
  maintainer="Itay Weinberger <itay@joo.la>, Or Weinberger <or@joo.la>"

COPY . /opt/joola/elastic-query-tracker

RUN \
  cd /opt/joola/elastic-query-tracker && \
  yarn install

ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# Environment
ENV NODE_ENV=production

# Entrypoint
WORKDIR /opt/joola/elastic-query-tracker
CMD ["dumb-init", "node", "index.js"]