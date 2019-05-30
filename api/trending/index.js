const { send } = require('micro')
const googleNews = require('my-google-news')
const url = require('url')

googleNews.resultsPerPage = 25 // max 100

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', `max-age=60, s-maxage=${60 * 10}`)

  let domains = []
  const articles = await new Promise(async (resolve) => {
    googleNews('breaking', (err, response) => {
      if (err || !response.links) return resolve([])
      let links = []
      response.links.map(link => {
        const domain = url.parse(link.href).host.replace(/^www./, '')

        // Skip 'accuweather.com' as it's not a good example
        if (domain === 'accuweather.com')
          return

        if (!domains.includes(domain))
          domains.push(domain)

        links.push({
          title: link.title,
          url: link.href,
          domain, 
        })
      })
      return resolve(links)
    })
  })

  return send(res, 200, {
    articles,
    domains
  })
}
