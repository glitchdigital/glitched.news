const moment = require('moment')
const SentimentIntensityAnalyzer = require('vader-sentiment').SentimentIntensityAnalyzer

const { send, queryParser } = require('lib/request-handler')
const { parseHtmlFromUrl } = require('lib/parse-html')

module.exports = async (req, res) => {
  const { url } = queryParser(req)

  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })

  const { metadata, structuredData, text } = req.locals ? req.locals : await parseHtmlFromUrl(url)

  const trustIndicators = { positive: [], negative: [] }

  if (metadata) {
    if (hasNewsArticleMetadata(metadata)) {
      trustIndicators.positive.push({
        text: "Identifies itself as a news article",
        description: "This page uses markup which identifies itself as a news article.\nNote: If this is not actually a news article then it is representing itself incorrectly. Opinion columns should be published as opinion articles and not as news articles."
      })
    } else {
      trustIndicators.negative.push({
        text: "Does not identify itself as a news article",
        description: "This page does not use markup which identifies itself as a news article."
      })
    }
    if (isOpinionArticle(metadata)) {
      trustIndicators.negative.push({
        text: "Identifies as an opinion article",
        description: "This is an opinion article and not a news article."
    })
    }
  }

  if (url.startsWith('https://')) {
    trustIndicators.positive.push({
      text: "URL uses encryption",
      description: "This page uses HTTPS.\nLegitimate news sites should all use encryption (but not all sites that use encryption are legitimate)."
    })
  } else {
    trustIndicators.negative.push({
      text: "URL does not use encryption",
      description: "This page does not use HTTPS.\nLegitimate news sites should all use encryption (but not all sites that use encryption are legitimate)."
  })
  }

  if (structuredData.date) {
    const datePublished = moment.utc(structuredData.date)
    const dateNow = moment()
    const daysAgo = dateNow.diff(datePublished, 'days')

    if (daysAgo > 30) {
      trustIndicators.negative.push({
        text: `Article publication date is ${datePublished.fromNow()}`,
        description: 'Older articles may contain outdated information.'
      })
    }
  }

  if (!structuredData.title) {
    trustIndicators.negative.push({
      text: `Unable to clearly identify headline`,
      description: 'It was not possibly to automatically identify the headline.'
    })
  }

  const wordCount = text.split(' ').length;
  if (text) {
    if (wordCount < 500) {
      trustIndicators.negative.push({
        text: `Article text is less than 500 words`,
        description: 'Short articles can be a sign that there is not much detail to backup a headline.\nAccurate stories tend to be at least 500 words.'
      })
    } else if (wordCount > 500) {
      trustIndicators.positive.push({
        text: `Article is at least 500 words`,
        description: 'Accurate stories tend to be at least 500 words.'
      })
    }
  } else {
    trustIndicators.negative.push({
      text: `Unable to clearly identify main text of article`,
      description: 'It was not possibly to automatically identify the main body of the article text.'
    })
  }

  const headlineSentiment = SentimentIntensityAnalyzer.polarity_scores(structuredData.title)
  const textSentiment = SentimentIntensityAnalyzer.polarity_scores(text)
  const overallSentiment = SentimentIntensityAnalyzer.polarity_scores(`${structuredData.title} ${structuredData.description} ${text}`)

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
  
  const responseData = {
    url,
    ...structuredData,
    characterCount: text.length,
    wordCount,
    sentiment,
    trustIndicators
  }

  if (req.locals && req.locals.useStreamingResponseHandler) {
    return Promise.resolve(responseData)
  } else {
    return send(res, 200, responseData)
  }
}

function hasNewsArticleMetadata(metadata) {
  if (metadata.microdata) {
    if (metadata.microdata.Article ||
        metadata.microdata.NewsArticle ||
        metadata.microdata.AnalysisNewsArticle ||
        metadata.microdata.BackgroundNewsArticle ||
        metadata.microdata.ReviewNewsArticle ||
        metadata.microdata.ReportageNewsArticle) {
        return true
    }
  }
  if (metadata.jsonld) {
    if (metadata.jsonld.Article ||
        metadata.jsonld.NewsArticle ||
        metadata.jsonld.AnalysisNewsArticle ||
        metadata.jsonld.BackgroundNewsArticle ||
        metadata.jsonld.ReviewNewsArticle ||
        metadata.jsonld.ReportageNewsArticle) {
          return true
    }
  }
  return false
}

function isOpinionArticle(metadata) {
  if (metadata.microdata) {
    if (metadata.microdata.OpinionNewsArticle) {
      return true
    }
  }
  if (metadata.jsonld) {
    if (metadata.jsonld.OpinionNewsArticle) {
      return true
    }
  }
  return false
}