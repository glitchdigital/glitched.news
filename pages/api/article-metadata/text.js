const fetch = require('node-fetch')
const unfluff = require('unfluff')
const Readability = require('readability')
const JSDOM = require("jsdom").JSDOM
const SentimentIntensityAnalyzer = require('vader-sentiment').SentimentIntensityAnalyzer

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
  const parsedArticle = reader.parse()
  const articleText = parsedArticle ? parsedArticle.textContent || structuredData.text || '' : ''

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

  const articleHeadlineSentiment = SentimentIntensityAnalyzer.polarity_scores(structuredData.title)
  const articleTextSentiment = SentimentIntensityAnalyzer.polarity_scores(articleText)
  const articleOverallSentiment = SentimentIntensityAnalyzer.polarity_scores(`${structuredData.title} ${structuredData.description} ${articleText}`)

  let articleSentencesSentiment = []
  sentences.forEach(sentence => {
    articleSentencesSentiment.push({
      length: sentence.replace(/\n/g, '').length,
      ...SentimentIntensityAnalyzer.polarity_scores(sentence.replace(/\n/g, ''))
    })
  })

  const sentiment = {
    headline: articleHeadlineSentiment,
    text: articleTextSentiment,
    overall: articleOverallSentiment,
    sentences: articleSentencesSentiment,
  }

  // Highly subjective score value
  let score = 0;

  quotes.forEach(() => score += 5)
  quotesWithNumbers.forEach(() => score += 5)
  sentencesWithNumbers.forEach(() => score += 2)

  if (articleText.length > 1500) {
    score += 20
  } else if (articleText.length > 1000) {
    score += 10
  } else if (articleText.length > 500) {
    score += 5
  }

  return send(res, 200, {
    url,
    quotes: quotes,
    quotesWithNumbers: quotesWithNumbers,
    sentencesWithNumbers: sentencesWithNumbers,
    trustIndicators,
    score,
    sentiment,
  })

}