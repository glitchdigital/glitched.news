const fetch = require('node-fetch')
const unfluff = require('unfluff')
const Readability = require('readability')
const JSDOM = require("jsdom").JSDOM

const { getQuotes } = require('lib/quotes')
const { send, queryParser } = require('lib/request-handler')
const fetchOptions = require('lib/fetch-options')

module.exports = async (req, res) => {
  const { url } = queryParser(req)

  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })

  const trustIndicators = { positive: [], negative: [] }
  const fetchRes = await fetch(encodeURI(url), fetchOptions)
  const html = await fetchRes.text()

  const structuredData = unfluff(html)
  const dom = new JSDOM(html, { url })
  const reader = new Readability(dom.window.document)

  const articleText = reader.parse().textContent || structuredData.text || ''


  const quotes = getQuotes(articleText)
  let quotesWithNumbers = []
  quotes.forEach(quote => {
    if (quote.match(/[0-9]/))
      quotesWithNumbers.push(quote)
  })

  const sentences = articleText.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/gm) || []
  let sentencesWithNumbers = []
  sentences.forEach(sentence => {
    if (sentence.match(/[0-9]/))
      sentencesWithNumbers.push(sentence.replace(/\n/g, ''))
  })

  if (quotes.length > 0) {
    trustIndicators.positive.push({ text: `${quotes.length} quotes cited in article` })
  } else {
    trustIndicators.negative.push({ text: `No quotes cited in article` })
  }

  return send(res, 200, {
    url,
    quotes: quotes,
    quotesWithNumbers: quotesWithNumbers,
    sentencesWithNumbers: sentencesWithNumbers,
    trustIndicators
  })

}