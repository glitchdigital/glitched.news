const unfluff = require('unfluff')
const Readability = require('readability')
const JSDOM = require("jsdom").JSDOM
const fetch = require('node-fetch')

const WAE = require('web-auto-extractor').default
const moment = require('moment')
const vader = require('vader-sentiment')

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
  const parsedArticle = reader.parse()
  const articleText = parsedArticle ? parsedArticle.textContent || structuredData.text || '' : ''

  if (metadata) {
    if (hasNewsArticleMetadata(metadata)) {
      trustIndicators.positive.push({
        text: "Page identifies itself as a news article",
        description: "This page uses markup which positively identifies itself as a news article."
      })
    } else {
      trustIndicators.negative.push({
        text: "Page does not identify itself as a news article",
        description: "This page does not use markup which identifies itself as a news article."
      })
    }
    if (isOpinionArticle(metadata)) {
      trustIndicators.negative.push({
        text: "Page identifies as an opinion article",
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

  const wordCount = articleText.split(' ').length;
  if (articleText) {
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
    characterCount: articleText.length,
    wordCount,
    sentiment,
    trustIndicators,
  })
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