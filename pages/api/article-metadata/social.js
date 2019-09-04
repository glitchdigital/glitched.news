const fetch = require('node-fetch')
const WAE = require('web-auto-extractor').default

const { send, queryParser } = require('lib/request-handler')
const fetchOptions = require('lib/fetch-options')

module.exports = async (req, res) => {
  const { url } = queryParser(req)
  
  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })

  const indicators = { positive: [], negative: [] }

  const fetchRes = await fetch(url, fetchOptions)
  const text = await fetchRes.text()
  const metadata = WAE().parse(text)

  let hasFacebookMetadata = false
  let hasTwitterMetadata = false

  if (metadata) {
    // @TODO Check for additional fields (and compare with content of article?)
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
    getFacebookShareCount(url)
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
    url,
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