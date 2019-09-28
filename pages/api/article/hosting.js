const urlParser = require('url')
const dns = require('dns')
const geoip = require('geoip-lite')

const { send, queryParser } = require('lib/request-handler')

module.exports = async (req, res) => {
  const { url } = queryParser(req)

  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })

  const urlParts = urlParser.parse(url)
  const hostname = urlParts.hostname

  dns.resolve(hostname, (error, address, family) => {
    return send(res, 200, {
      url,
      hostname,
      ip: address,
      location: (address) ? geoip.lookup(address[0]) : null
    })
  })
}