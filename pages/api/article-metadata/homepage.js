const urlParser = require('url')
const JSDOM = require("jsdom").JSDOM
const fetch = require('node-fetch')

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

  let links = []
  dom.window.document.querySelectorAll('a').forEach(node => {
    // Get URL
    let url = node.getAttribute('href') || ''

    if (url.startsWith('javascript:'))
      return

    // Strip anchor text
    url = url.replace(/#(.*)$/, '')
    
    // Strip the trailing slash from URLs (as long as they don't have query string)
    // This is a normalization step that technical might cause problems but in
    // practice is useful for de-duping links on page.
    if (!url.includes('?'))
      url = url.replace(/\/$/, '')

    // If URL does not start with a protocol (or //:) then append base URL so the result
    // is an absolute link, rather than a relative one.
    // FIXME: There are edge cases where this approach may not be correct - eg pages that use
    // the <base> tag, but these are rarely used in practice.
    if (!url.match(/[A-z]:/) && !url.startsWith('//:')) {
      url = `${homepage}${url}`
    }

    links.push({
      url,
      text: node.textContent.replace('\n', '').trim() || '',
      domain: urlParts.parse(url).hostname
    })
  })
  links = removeDuplicates(links, 'url')

  return send(res, 200, {
    domain,
    homepage,
    links
  })
}

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
  })
}