const urlParser = require('url')
const JSDOM = require("jsdom").JSDOM
 
const { send, queryParser } = require('lib/request-handler')
const fetchOptions = require('lib/fetch-options')

// Given a URL, wil return the domain, homepage and a list of links on the page
module.exports = async (req, res) => {
  const { url } = queryParser(req)

  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })

  const urlParts = urlParser.parse(url)
  const domain = urlParts.hostname
  const homepage = `${urlParts.protocol}//${urlParts.host}`

  const fetchRes = await fetch(encodeURI(url), fetchOptions)
  const html = await fetchRes.text()

  const dom = new JSDOM(html, { url })

  const links = []
  dom.window.document.querySelectorAll('a').forEach(node => {
    // Get URL (striping anchors)
    let url = node.getAttribute('href').replace(/#(.*)$/, '')

    // If URL does not start with HTTP or HTTPS (or //:) then append base URL so the result
    // is an absolute link, rather than a relative one.
    // FIXME: There are edge cases where this approach may not be correct - eg pages that use
    // the <base> tag, but these are rarely used in practice.
    if (!url.startsWith('http:') && !url.startsWith('https:') &&  !url.startsWith('//:')) {
      url = `${homepage}${url}`
    }

    links.push({
      url,
      text: node.textContent.replace('\n', '').trim() || ''
    })
  })

  return send(res, 200, {
    domain,
    homepage,
    links: removeDuplicates(links, 'url')
  })
}

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
  })
}