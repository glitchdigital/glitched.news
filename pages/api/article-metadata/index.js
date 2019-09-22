//require('promise.allsettled').shim()
const fetch = require('node-fetch')
const { send, queryParser } = require('lib/request-handler')

module.exports = async (req, res) => {
  const { url, stream } = queryParser(req)

  const endpoints = [
    'blacklists',
    'content',
    // 'domain', // Disabled due to webpack issue with whois module since upgrading to Next.js 9
    'factchecks',
    'hosting',
    'related',
    // 'social', // Removing social check as is redundant (and doesn't check accurately!)
    'text',
    'links',
    'topics',
    'structured-data'
  ]

  const protocol = (req.headers['x-forwarded-proto']) ? req.headers['x-forwarded-proto'] : 'http'
  const server = req.headers['host']

  let data = {}

  if (stream === 'true') {
    // Handle Streaming response
    res.writeHead(200, {
      Connection: "keep-alive",
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache,no-transform',
      'X-Accel-Buffering': 'no'
    })

    res.write(`id: none\n`)

    endpoints.map(async (endpoint) => {
      try {
        const fetchRequest = await fetch(`${protocol}://${server}/api/article-metadata/${endpoint}?url=${encodeURIComponent(url)}`)
        data[endpoint] = await fetchRequest.json()
      } catch (e) {
        data[endpoint] = null
      }
      
      // Return data to client
      res.write(`data: ${JSON.stringify({
        endpoint,
        data: data[endpoint],
        inProgress: (Object.keys(data).length === endpoints.length) ? false : true
      })}\n\n`)

      // Close connection once all end points called
      if (Object.keys(data).length === endpoints.length) {
        res.end()
      }
    })
  } else {
    // Handle HTTP response
    // Use fetch to call each endpoint concurrently
    await Promise.all(
      endpoints.map(async (endpoint) => {
        const fetchRequest = await fetch(`${protocol}://${server}/api/article-metadata/${endpoint}?url=${encodeURIComponent(url)}`)
        data[endpoint] = await fetchRequest.json()
        return Promise.resolve()
      })
    )

    return send(res, 200, data)
  }
}