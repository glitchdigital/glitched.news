const fetch = require('node-fetch')
const unfluff = require('unfluff')
const Readability = require('readability')
const JSDOM = require("jsdom").JSDOM
const WAE = require('web-auto-extractor').default

const fetchOptions = require('lib/fetch-options')

const parseHtml = (html, url) => {
  // Get Metadata
  const metadata = WAE().parse(html)

  // Parse HTML into structured format
  const structuredData = unfluff(html)

  // Parse for text using Readability
  const dom = new JSDOM(html, { url })
  const reader = new Readability(dom.window.document)
  const article = reader.parse()

  // Get article text using Readability if possible, fallback to structured data extraction
  const text = article ? article.textContent || structuredData.text || '' : ''

  return {
    structuredData,
    metadata,
    article,
    text,
    html
  }
}

const parseHtmlFromUrl = async (url) => {
  const fetchRes = await fetch(encodeURI(url), fetchOptions)
  const html = await fetchRes.text()
  return {
    url,
    ...parseHtml(html, url)
  }
}

module.exports = {
  parseHtml,
  parseHtmlFromUrl
}
