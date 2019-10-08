const sbdTokenizer = require('sbd')
const SentimentIntensityAnalyzer = require('vader-sentiment').SentimentIntensityAnalyzer

const { send, queryParser } = require('lib/request-handler')
const { parseHtmlFromUrl } = require('lib/parse-html')
const { getQuotes } = require('lib/quotes')

module.exports = async (req, res) => {
  const { url } = queryParser(req)

  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })

  const { structuredData, text } = req.locals ? req.locals : await parseHtmlFromUrl(url)

  const trustIndicators = { positive: [], negative: [] }

  const quotes = getQuotes(text)
  let quotesWithNumbers = []
  quotes.forEach(quote => {
    if (quote.match(/[0-9]/))
      quotesWithNumbers.push(quote)
  })

  const sentences = sbdTokenizer.sentences(text, { newline_boundaries: true })
  
  let sentencesWithNumbers = []
  sentences.forEach(sentence => {
    if (sentence.match(/[0-9]/))
      sentencesWithNumbers.push(sentence.replace(/\n/g, ' '))
  })

  if (quotes.length > 1) {
    trustIndicators.positive.push({ 
      text: `Multiple quotes cited in article`,
      description: 'Articles that contain quotes are useful as quotes can be verified.'
    })
  } else {
    trustIndicators.negative.push({
      text: `No quotes cited in article`,
      description: 'It is unusual for legitimate news articles not to contain multiple quotes.\nQuotes are useful as they can be verified.'
    })
  }

  const articleHeadlineSentiment = SentimentIntensityAnalyzer.polarity_scores(structuredData.title)
  const articleTextSentiment = SentimentIntensityAnalyzer.polarity_scores(text)
  const articleOverallSentiment = SentimentIntensityAnalyzer.polarity_scores(`${structuredData.title} ${structuredData.description} ${text}`)

  let articleSentencesSentiment = []
  sentences.forEach(sentence => {
    articleSentencesSentiment.push({
      length: sentence.replace(/\n/g, ' ').length,
      ...SentimentIntensityAnalyzer.polarity_scores(sentence.replace(/\n/g, ' '))
    })
  })

  const sentiment = {
    headline: articleHeadlineSentiment,
    text: articleTextSentiment,
    overall: articleOverallSentiment,
    sentences: articleSentencesSentiment,
  }

  // Highly experimental text score
  let score = 0;

  quotes.forEach(() => score += 5)
  quotesWithNumbers.forEach(() => score += 5)
  sentencesWithNumbers.forEach(() => score += 2)

  if (sentencesWithNumbers.length > 3) {
    trustIndicators.positive.push({ 
      text: `Multiple data points in article`,
      description: 'Articles that contain multiple data points are useful as quotes can be verified.'
    })
  } else if (sentencesWithNumbers.length > 0) {
    trustIndicators.positive.push({ 
      text: `Few data points in article`,
      description: 'Articles that contain few data points may be suspect as they may be harder to verify.'
    })
  } else {
    trustIndicators.positive.push({ 
      text: `No data points in article`,
      description: 'Articles that contain no data points may be suspect as they may be harder to verify.'
    })
  }
  
  const wordCount = text.split(' ').length;
  if (wordCount.length > 1500) {
    score += 20
  } else if (wordCount.length > 1000) {
    score += 10
  } else if (wordCount.length > 500) {
    score += 5
  }

  if (score > 50) {
    trustIndicators.positive.push({
      text: "Article contains detailed and specific information",
      description: 'Articles that contain lots of quotes and data points that can be fact checked are easier to verify.'
    })
  }

  const responseData = {
    url,
    quotes,
    quotesWithNumbers,
    sentencesWithNumbers,
    trustIndicators,
    score,
    sentiment,
    wordCount
  }

  if (req.locals && req.locals.useStreamingResponseHandler) {
    return Promise.resolve(responseData)
  } else {
    return send(res, 200, responseData)
  }
}