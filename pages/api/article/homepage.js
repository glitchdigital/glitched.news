const urlParser = require('url')
const JSDOM = require("jsdom").JSDOM
const fetch = require('node-fetch')

const { send, queryParser } = require('lib/request-handler')
const fetchOptions = require('lib/fetch-options')
const normalizeUrl = require('lib/normalize-url')

// Given a URL, wil return the domain, homepage and a list of links on the homepage
module.exports = async (req, res) => {
  const { url } = queryParser(req)

  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })

  const urlParts = urlParser.parse(url)
  const domain = urlParts.hostname
  const homepage = `${urlParts.protocol}//${urlParts.host}`

  const fetchRes = await fetch(encodeURI(homepage), fetchOptions)
  const html = await fetchRes.text()

  const dom = new JSDOM(html, { homepage })

  let links = []
  dom.window.document.querySelectorAll('a').forEach(node => {
    let url = node.getAttribute('href') || ''

    if (url.startsWith('javascript:'))
      return

    url = normalizeUrl(url, homepage)

    links.push({
      url,
      text: node.textContent.replace('\n', '').trim() || '',
      domain: urlParts.parse(url).hostname
    })
  })
  // Remove duplicate URLs
  links = links.filter((obj, pos, arr) => arr.map(mapObj => mapObj['url']).indexOf(obj['url']) === pos)

  return send(res, 200, {
    domain,
    homepage,
    links
  })
}