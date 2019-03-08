const { send } = require('micro')
const microQuery = require('micro-query')
const url = require('url')
const dns = require('dns')
const geoip = require('geoip-lite')

module.exports = async (req, res) => {
  const query = microQuery(req)

  let hostname = ''

  if (query.url) {
    const urlParts = url.parse(query.url)
    hostname = urlParts.hostname
  } else if (query.hostname) {
    hostname = query.domain
  } else {
    return send(res, 400, { error: 'URL or hostname parameter required' })
  }

  dns.resolve(hostname, (error, address, family) => {
    return send(res, 200, {
      hostname,
      ip: address,
      location: (address) ? geoip.lookup(address[0]) : null
    })
  })
}