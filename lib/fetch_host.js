function fetch(hosts) {
  hosts = hosts.split(',');
  return hosts[Math.floor(Math.random() * hosts.length)];
}

module.exports = fetch;
