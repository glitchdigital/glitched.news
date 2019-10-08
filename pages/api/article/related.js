const googleNews = require('my-google-news')
const urlParser = require('url')

const { send, queryParser } = require('lib/request-handler')
const { parseHtmlFromUrl } = require('lib/parse-html')

googleNews.resultsPerPage = 25 // Can be max 100

module.exports = async (req, res) => {
  const { url } = queryParser(req)

  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })

  const { structuredData } = req.locals ? req.locals : await parseHtmlFromUrl(url)

  // Build word list
  const words = [ 
    structuredData.title
  ].join(' ').replace(/[^A-z0-9\- ]/mg, ' ')

  let domains = []
  let articles = []

  await new Promise(async (resolve) => {
    googleNews(words, (err, response) => {
      if (err || !response.links) return resolve([])
      let links = response.links.map(link => {
        // If article URL matches input URL do not consider it
        // a 'related article'
        if (link.href === url) return

        // Simple approach to domain checking is fine
        // Some sites have subdomains that are different publications
        // and this approach works well with that
        const domain = urlParser.parse(link.href).host.replace(/^www./, '')
        if (!domains.includes(domain))
          domains.push(domain)
        
        articles.push({
          title: link.title,
          url: link.href,
          domain
        })
      })
      return resolve(links)
    })
  })

  const trustIndicators = { positive: [], negative: [] }

  if (domains.length > 0) {
    if (domains.length > 3) {
      trustIndicators.positive.push({
        text: "Multiple sites have similar articles",
        description: 'News stories that are accurate are usually reported on by multiple publications.'
      })
    } else {
      trustIndicators.negative.push({
        text: "Few other sites have similar articles",
        description: 'News stories that are accurate are usually reported on by multiple publications.\nIf few sites are reporting a story it can be harder to verify.'
      })
    }

    if (articles.length > 10) {
      trustIndicators.positive.push({
        text: "Multiple related articles found",
        description: 'The more articles covering a story, the easier it can be to verify.'
      })
    } else {
      trustIndicators.negative.push({
        text: "Not many other related articles found",
        description: 'A story that is not widely covered can be harder to verify.'
      })
    }
  } else {
    trustIndicators.negative.push({
      text: "No other similar articles found on other sites",
      description: 'News stories that are accurate are usually reported on by multiple publications.\nIf few other sites are reporting the story it is harder to verify.'
    })
  }

  const responseData = {
    url,
    articles,
    domains,
    trustIndicators
  }

  if (req.locals && req.locals.useStreamingResponseHandler) {
    return Promise.resolve(responseData)
  } else {
    return send(res, 200, responseData)
  }
}
