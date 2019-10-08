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
    let linkUrl = node.getAttribute('href') || ''

    if (linkUrl.startsWith('javascript:'))
      return

    linkUrl = normalizeUrl(linkUrl, homepage)

    links.push({
      url: linkUrl,
      text: node.textContent.replace('\n', '').trim() || '',
      domain: urlParts.parse(linkUrl).hostname
    })
  })
  // Remove duplicate URLs
  links = links.filter((obj, pos, arr) => arr.map(mapObj => mapObj['url']).indexOf(obj['url']) === pos)

  const responseData = {
    domain,
    homepage,
    links
  }

  if (req.locals && req.locals.useStreamingResponseHandler) {
    return Promise.resolve(responseData)
  } else {
    return send(res, 200, responseData)
  }
}