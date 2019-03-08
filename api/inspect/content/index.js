const { send } = require('micro')
const microQuery = require('micro-query')
const unfluff = require('unfluff')
const fetch = require('node-fetch')
const url = require('url')
const WAE = require('web-auto-extractor').default
const moment = require('moment')
const tokenizer = require('sbd')
const parser = require('quote-parser')

const fetchOptions = require('./fetch-options')

module.exports = async (req, res) => {
  const query = microQuery(req)

  if (!query.url)
    return send(res, 400, { error: 'URL parameter missing' })

  const indicators = { positive: [], negative: [] }
  
  const fetchRes = await fetch(query.url, fetchOptions)
  const text = await fetchRes.text()
  const structuredData = unfluff(text)
  const metadata = WAE().parse(text)

  if (metadata) {
    if (hasNewsArticleMetadata(metadata)) {
      indicators.positive.push({text: "Page identifies as a news article"})
    }
  }

  if (query.url.startsWith('https://')) {
    indicators.positive.push({text: "URL is encrypted (uses HTTPS)"})
  } else {
    indicators.negative.push({text: "URL is not encrypted (does not use HTTPS)"})
  }

  if (structuredData.links) {
    if (structuredData.links.length > 15) {
      indicators.negative.push({text: "Unusually high number of links in the article"})
    }

    structuredData.links = structuredData.links.map(link => {
      if (!link.href.includes('://')) {
        link.url = `${url.parse(query.url).protocol}//${url.parse(query.url).hostname}${link.href}`
      } else {
        link.url = link.href
      }
      link.title = truncate(link.url, 50)
      link.domain = (link.url && url.parse(link.url).host) ? url.parse(link.url).host.replace(/^www./, '') : null
      return link
    })
  }

  if (structuredData.date) {
    const datePublished = moment.utc(structuredData.date)
    const dateNow = moment()
    const daysAgo = dateNow.diff(datePublished, 'days')

    if (daysAgo > 30) {
      indicators.negative.push({text: `The article publication date is ${datePublished.fromNow()}`})
    }
  }

  if (!structuredData.title) {
    indicators.negative.push({text: `Unable to clearly identify headline`})
  }

  if (structuredData.text) {
    if (structuredData.text.length < 500) {
      indicators.negative.push({text: `Main text of article is unusually short`})
    }
  } else {
    indicators.negative.push({text: `Unable to clearly identify main text of article`})
  }

  const sentences = tokenizer.sentences(structuredData.text) || []
  const sentencesWithQuotes = structuredData.text.replace(/[“”]/g, '"').replace(/ "/g, "\n").split("\n")

  let quotes = []
  const rawQuotes = structuredData.text.replace(/[“”]/g, '"').replace(/[”]/g, '".').match(/(["])(\\?.)*?\1/gm) || []

  rawQuotes.forEach(quote => {
    const trimmedQuote = quote.replace(/( )*"( )*/, '"')
    if (trimmedQuote.length > 15) {
      quotes.push(trimmedQuote)
    }
  })

  let sentencesWithNumbers = []

  sentences.forEach(sentence => {
    if (sentence.match(/[0-9]/)) {
      sentencesWithNumbers.push(sentence)
    }
  })

  sentencesWithQuotes.forEach(sentence => {
    if (sentence) {
      parser.parse(sentence, 'en', { minLength: 10 } ).forEach(quote => {
        quotes.push(quote.text)
      })
    }
  }) 
  
  let quotesWithNumbers = []
  quotes.forEach(quote => {
    if (quote.match(/[0-9]/))
      quotesWithNumbers.push(quote)
  })  

  if (quotes.length > 0) {
    indicators.positive.push({ text: `${quotes.length} quotes cited in article` })
  } else {
    indicators.negative.push({ text: `No quotes cited in article` })
  }

  return send(res, 200, {
    url: query.url,
    ...structuredData,
    quotes,
    quotesWithNumbers,
    sentencesWithNumbers,
    indicators
  })

}

function truncate(str, length, ending) {
  if (length == null)
    length = 100

  if (ending == null)
    ending = '...'

  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending
  } else {
    return str
  }
}

function hasNewsArticleMetadata(metadata) {
  // @TODO Support checks for different type of news article metadata
  if (metadata.microdata) {
    if (metadata.microdata.Article ||
        metadata.microdata.NewsArticle ||
        metadata.microdata.ReportageNewsArticle) {
        return true
    }
  }
  if (metadata.jsonld) {
    if (metadata.jsonld.Article ||
        metadata.jsonld.NewsArticle ||
        metadata.jsonld.ReportageNewsArticle) {
          return true
    }
  }
  return false
}