const { send } = require('micro')
const microQuery = require('micro-query')
const unfluff = require('unfluff')
const fetch = require('node-fetch')

const fetchOptions = require('../content/fetch-options')

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', `max-age=60, s-maxage=${60 * 60}`)
  
  const query = microQuery(req)

  if (!query.url)
    return send(res, 400, { error: 'URL parameter missing' })

  const indicators = { positive: [], negative: [] }
  
  const fetchRes = await fetch(query.url, fetchOptions)
  const text = await fetchRes.text()
  const structuredData = unfluff(text)

  const quotes = structuredData.text.match(/(["])(\\?.)*?\1/gm)
  let quotesWithNumbers = []
  quotes.forEach(quote => {
    if (quote.match(/[0-9]/))
      quotesWithNumbers.push(quote)
  })

  const sentances = structuredData.text.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/gm)
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
    url: query.url,
    quotes: quotes,
    quotesWithNumbers: quotesWithNumbers,
    sentancesWithNumbers: sentancesWithNumbers,
    indicators
  })

}