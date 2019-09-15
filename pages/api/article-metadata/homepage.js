const urlParser = require('url')
const JSDOM = require("jsdom").JSDOM
 
const { send, queryParser } = require('lib/request-handler')
const fetchOptions = require('lib/fetch-options')

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

  const links = []
  dom.window.document.querySelectorAll('a').forEach(function(node) {
    const href = node.getAttribute('href')
    if (href.startsWith('javascript:'))
      return

    links.push({
      url: href,
      text: node.textContent.replace('\n', '').trim() || ''
    })
  })

  return send(res, 200, {
    domain,
    homepage,
    links
  })
}
