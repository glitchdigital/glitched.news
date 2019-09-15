const unfluff = require('unfluff')
const Readability = require('readability')
const JSDOM = require("jsdom").JSDOM
const fetch = require('node-fetch')
const urlParser = require('url')
const WAE = require('web-auto-extractor').default
const moment = require('moment')
const tokenizer = require('sbd')
const vader = require('vader-sentiment')

const truncate = require('lib/truncate')
const { getQuotes } = require('lib/quotes')
const { send, queryParser } = require('lib/request-handler')
const fetchOptions = require('lib/fetch-options')

// @TODO Consider pros and cons of breaking out functionality into different endpoints
module.exports = async (req, res) => {
  const { url } = queryParser(req)

  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })

  const trustIndicators = { positive: [], negative: [] }
  const fetchRes = await fetch(encodeURI(url), fetchOptions)
  const html = await fetchRes.text()
  const structuredData = unfluff(html)
  const metadata = WAE().parse(html)

  const dom = new JSDOM(html, { url })
  const reader = new Readability(dom.window.document)
  const articleText = reader.parse().textContent || structuredData.text || ''

  if (metadata) {
    if (hasNewsArticleMetadata(metadata)) {
      trustIndicators.positive.push({text: "Page identifies as a news article"})
    }
  }

  if (url.startsWith('https://')) {
    trustIndicators.positive.push({text: "URL is encrypted (uses HTTPS)"})
  } else {
    trustIndicators.negative.push({text: "URL is not encrypted (does not use HTTPS)"})
  }

  let links = []
  if (structuredData.links) {
    if (structuredData.links.length > 15) {
      trustIndicators.negative.push({text: "Unusually high number of links in the article"})
    }

    links = structuredData.links.map(link => {
      if (!link.href.includes('://')) {
        link.url = `${urlParser.parse(url).protocol}//${urlParser.parse(url).hostname}${link.href}`
      } else {
        link.url = link.href
      }

      link.title = truncate(link.url, 50)
      link.domain = (link.url && urlParser.parse(link.url).host) ? urlParser.parse(link.url).host.replace(/^www./, '') : null

      return {
        url: link.url,
        title: link.title,
        domain: link.domain
      }
    })
  }
  links = removeDuplicateObjectsFromArray(links, 'url')

  if (structuredData.date) {
    const datePublished = moment.utc(structuredData.date)
    const dateNow = moment()
    const daysAgo = dateNow.diff(datePublished, 'days')

    if (daysAgo > 30) {
      trustIndicators.negative.push({text: `The article publication date is ${datePublished.fromNow()}`})
    }
  }

  if (!structuredData.title) {
    trustIndicators.negative.push({text: `Unable to clearly identify headline`})
  }

  if (articleText) {
    if (articleText.length < 500) {
      trustIndicators.negative.push({text: `Main text of article is unusually short`})
    }
  } else {
    trustIndicators.negative.push({text: `Unable to clearly identify main text of article`})
  }

  // Parse for Quotes
  const quotes = getQuotes(articleText)
  let quotesWithNumbers = []

  quotes.forEach(quote => {
    if (quote.match(/[0-9]/))
      quotesWithNumbers.push(quote)
  })  

  if (quotes.length > 0) {
    trustIndicators.positive.push({ text: `${quotes.length} quotes cited in article` })
  } else {
    trustIndicators.negative.push({ text: `No quotes cited in article` })
  }

  // Parse for Sentences
  const sentences = tokenizer.sentences(articleText) || []
  let sentencesWithNumbers = []

  sentences.forEach(sentence => {
    if (sentence.match(/[0-9]/)) {
      sentencesWithNumbers.push(sentence)
    }
  })

  const headlineSentiment = vader.SentimentIntensityAnalyzer.polarity_scores(structuredData.title)
  const textSentiment = vader.SentimentIntensityAnalyzer.polarity_scores(articleText)
  const overallSentiment = vader.SentimentIntensityAnalyzer.polarity_scores(`${structuredData.title} ${structuredData.description} ${articleText}`)

  const sentiment = {
    headline: { 
      positive: Math.round(headlineSentiment.pos * 100),
      neutral:  Math.round(headlineSentiment.neu * 100),
      negative: Math.round(headlineSentiment.neg * 100),
      compound: Math.round(headlineSentiment.compound * 100)
    },
    body: {
      positive: Math.round(textSentiment.pos * 100),
      neutral:  Math.round(textSentiment.neu * 100),
      negative: Math.round(textSentiment.neg * 100),
      compound: Math.round(textSentiment.compound * 100)
    },
    overall: {
      positive: Math.round(overallSentiment.pos * 100),
      neutral:  Math.round(overallSentiment.neu * 100),
      negative: Math.round(overallSentiment.neg * 100),
      compound: Math.round(overallSentiment.compound * 100)
    }
  }
  
  return send(res, 200, {
    url,
    ...structuredData,
    links,
    characterCount: articleText.length,
    wordCount: articleText.split(' ').length,
    quotes,
    quotesWithNumbers,
    sentencesWithNumbers,
    sentiment,
    trustIndicators,
  })
}

function removeDuplicateObjectsFromArray(array, property) {
  let uniqueItems = {}
  array.forEach(item => { uniqueItems[item[property]] = item })
  return Object.values(uniqueItems)
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