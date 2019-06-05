const fetch = require('node-fetch')

const { send, addHeaders, queryParser } = require('../lib/helper')

module.exports = async (req, res) => {
  addHeaders(res)

  const { url } = queryParser(req)
  const protocol = (req.headers['x-forwarded-proto']) ? req.headers['x-forwarded-proto'] : 'https'
  const server = req.headers['host']

  let response = {}

  // Use fetch to call each endpoint concurrently
  await Promise.all(
    [
      'blacklists',
      'content',
      'domain',
      'factchecks',
      'hosting',
      'related',
      'social',
      'text',
      'topics'
    ].map(async (endpoint) => {
      console.log("okay")
      const request = await fetch(`${protocol}://${server}/api/article-metadata/${endpoint}?url=${url}`)
      response[endpoint] = await request.json()
      console.log("done", endpoint)
      return Promise.resolve()
    })
  )

  console.log("DONE DONE", response)

  return send(res, 200, response)
}