// Testing using the Readability module to parse articles
const fetch = require('node-fetch')
const unfluff = require('unfluff')

const { send, queryParser } = require('lib/request-handler')
const fetchOptions = require('lib/fetch-options')

module.exports = async (req, res) => {
  const { url } = queryParser(req)

  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })

  const fetchRes = await fetch(url, fetchOptions)
  const html = await fetchRes.text()
  const article =  unfluff(html)
  
  return send(res, 200, {
    article
  })
}
