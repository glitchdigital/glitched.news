const fetch = require('node-fetch')
const unfluff = require('unfluff')

const { send, queryParser } = require('../../../lib/request-handler')
const fetchOptions = require('../../../lib/fetch-options')

module.exports = async (req, res) => {
  const { url } = queryParser(req)

  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })

  const indicators = { positive: [], negative: [] }
  const fetchRes = await fetch(url, fetchOptions)
  const text = await fetchRes.text()
  const structuredData = unfluff(text)

  const quotes = structuredData.text.match(/(["])(\\?.)*?\1/gm) || []
  let quotesWithNumbers = []  
  quotes.forEach(quote => {
    if (quote.match(/[0-9]/))
      quotesWithNumbers.push(quote)
  })

  const sentances = structuredData.text.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/gm) || []
  let sentancesWithNumbers = []
  sentances.forEach(sentance => {
    if (sentance.match(/[0-9]/))
      sentancesWithNumbers.push(sentance.replace(/\n/g, ''))
  })

  if (quotes.length > 0) {
    indicators.positive.push({ text: `${quotes.length} quotes cited in article` })
  } else {
    indicators.negative.push({ text: `No quotes cited in article` })
  }

  return send(res, 200, {
    url,
    quotes: quotes,
    quotesWithNumbers: quotesWithNumbers,
    sentancesWithNumbers: sentancesWithNumbers,
    indicators
  })

}