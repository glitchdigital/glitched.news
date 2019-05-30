const { send } = require('micro')
const microQuery = require('micro-query')
const fetch = require('node-fetch')
const WAE = require('web-auto-extractor').default

const fetchOptions = require('../content/fetch-options')

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', `max-age=60, s-maxage=${60 * 60}`)
  
  const query = microQuery(req)
  
  if (!query.url)
    return send(res, 400, { error: 'URL parameter missing' })

  const indicators = { positive: [], negative: [] }

  const fetchRes = await fetch(query.url, fetchOptions)
  const text = await fetchRes.text()
  const metadata = WAE().parse(text)

  let hasFacebookMetadata = false
  let hasTwitterMetadata = false

  if (metadata) {
    if (metadata.metatags) {
      if (metadata.metatags['fb:app_id']) {
        hasFacebookMetadata = true
      }
      if (metadata.metatags['twitter:card']) {
        hasTwitterMetadata = true
      }
    }
  }

  // @TODO Add other platforms here
  const resolved = await Promise.all([
    getFacebookShareCount(query.url)
  ])

  const shareData = {
    facebook: resolved[0] || {},
    twitter: {}
  }

  if (hasFacebookMetadata)
    shareData.facebook.metadata = true

  if (hasTwitterMetadata)
    shareData.twitter.metadata = true

  if (shareData.facebook.share_count && shareData.facebook.share_count === 0) {
    indicators.negative.push({text: "No-one has shared this URL on Facebook"})
  }

  return send(res, 200, {
    url: query.url,
    ...shareData,
    indicators
  })
}

// @FIXME Facebook have changed this API; this no longer works
async function getFacebookShareCount(url) {
  const res = await fetch(`https://graph.facebook.com/${url}`)
  const json = await res.json()
  return json.share
}