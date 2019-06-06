const unfluff = require('unfluff')
const googleNews = require('my-google-news')
const fetch = require('node-fetch')
const urlParser = require('url')

const { send, queryParser } = require('../../../lib/request-handler')
const fetchOptions = require('../../../lib/fetch-options')

googleNews.resultsPerPage = 25 // Can be max 100

module.exports = async (req, res) => {
  const { url } = queryParser(req)

  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })

  // Fetch page
  const fetchRes = await fetch(url, fetchOptions)
  const text = await fetchRes.text()
  const structuredData = unfluff(text)

  // Build word list
  const words = [ 
    structuredData.title
  ].join(' ').replace(/[^A-z0-9\- ]/mg, ' ')

  let domains = []
  const articles = await new Promise(async (resolve) => {
    googleNews(words, (err, response) => {
      if (err || !response.links) return resolve([])
      let links = response.links.map(link => {
        const domain = urlParser.parse(link.href).host.replace(/^www./, '')
        if (!domains.includes(domain))
          domains.push(domain)
        return {
          title: link.title,
          url: link.href,
          domain, 
        }
      })
      return resolve(links)
    })
  })

  const indicators = { positive: [], negative: [] }

  if (domains.length > 0) {
    if (domains.length > 3) {
      indicators.positive.push({text: "Multiple sites have similar articles"})
    } else {
      indicators.negative.push({text: "Few other sites have similar articles"})
    }

    if (articles.length > 10) {
      indicators.positive.push({text: "Multiple related articles found"})
    } else {
      indicators.negative.push({text: "Not many other related articles found"})
    }
  } else {
    indicators.negative.push({text: "No other similar articles found on other sites"})
  }

  return send(res, 200, {
    url,
    articles,
    domains,
    indicators
  })
}
