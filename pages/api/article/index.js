//require('promise.allsettled').shim()

const { send, queryParser } = require('lib/request-handler')
const { parseHtmlFromUrl } = require('lib/parse-html')

const requestHandlers = {
  blacklists: require('./blacklists'),
  content: require('./content'),
  factchecks: require('./factchecks'),
  hosting: require('./hosting'),
  related: require('./related'),
  text: require('./text'),
  homepage: require('./homepage'),
  links: require('./links'),
  topics: require('./topics'),
  'structured-data': require('./structured-data')
}

module.exports = async (req, res) => {
  const { url, stream } = queryParser(req)

  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })

  // Add parse HTML to req object so can be re-used by endpoints
  // This avoids having to fetch and parse the URL for each endpoint.
  req.locals = {
    url,
    useStreamingResponseHandler: true,
    ...await parseHtmlFromUrl(url)
  }

  const endpoints = [
    'blacklists',
    'content',
    // 'domain', // Disabled due to webpack issue with whois module since upgrading to Next.js 9
    'factchecks',
    'hosting',
    'related',
    // 'social', // Removing social check as is redundant (and doesn't check accurately!)
    'text',
    'homepage',
    'links',
    'topics',
    'structured-data'
  ]

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
      if (requestHandlers[endpoint]) {
        data[endpoint] = await requestHandlers[endpoint](req, res)
      } else {
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
        if (requestHandlers[endpoint]) {
          data[endpoint] = await requestHandlers[endpoint](req, res)
        } else {
          data[endpoint] = null
        }
        return Promise.resolve()
      })
    )

    return send(res, 200, data)
  }
}