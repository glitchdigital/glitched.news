// Testing using the Readability module to parse articles
const fetch = require('node-fetch')
const Readability = require('readability')
const JSDOM = require("jsdom").JSDOM

const { send, queryParser } = require('lib/request-handler')
const fetchOptions = require('lib/fetch-options')

module.exports = async (req, res) => {
  const { url } = queryParser(req)

  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })

  // Fetch URL
  const fetchRes = await fetch(encodeURI(url), fetchOptions)
  const html = await fetchRes.text()

  // Parse article
  const dom = new JSDOM(html, { url })
  const reader = new Readability(dom.window.document)
  const article = reader.parse()

  return send(res, 200, {
    article
  })
}
