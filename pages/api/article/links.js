const JSDOM = require("jsdom").JSDOM
const urlParser = require('url')

const { send, queryParser } = require('lib/request-handler')
const { parseHtmlFromUrl } = require('lib/parse-html')
const normalizeUrl = require('lib/normalize-url')

// Given a URL, wil return the domain, homepage and a list of links on the page
module.exports = async (req, res) => {
  const { url: queryUrl } = queryParser(req)

  if (!queryUrl)
    return send(res, 400, { error: 'URL parameter missing' })

  const { html, url } = req.locals ? req.locals : await parseHtmlFromUrl(queryUrl)

  const urlParts = urlParser.parse(url)
  const path = urlParts.path
  const domain = urlParts.hostname
  const homepage = `${urlParts.protocol}//${urlParts.host}`

  const dom = new JSDOM(html, { queryUrl })

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
    path,
    homepage,
    links
  }

  if (req.locals && req.locals.useStreamingResponseHandler) {
    return Promise.resolve(responseData)
  } else {
    return send(res, 200, responseData)
  }
}