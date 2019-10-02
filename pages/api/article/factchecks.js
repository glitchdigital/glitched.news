const fetch = require('node-fetch')
const unfluff = require('unfluff')
const google = require('google')

const { send, queryParser } = require('lib/request-handler')
const fetchOptions = require('lib/fetch-options')

google.resultsPerPage = 25

module.exports = async (req, res) => {
  const { url } = queryParser(req)
  
  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })
  
  const fetchRes = await fetch(encodeURI(url), fetchOptions)
  const text = await fetchRes.text()
  const structuredData = unfluff(text)

  const trustIndicators = { positive: [], negative: [] }

  const factChecks = { 'snopes': [], 'factcheck.org': [] }
  let potentiallyDisputed = false

  await Promise.all([
    new Promise(resolve => {
      google(`${structuredData.title} site:www.snopes.com`, (err, res) => {
        if (!err) {
          if (res.links.length === 0) {
            trustIndicators.positive.push({text: "No related articles Snopes"})
          } else {
            const links = []
            res.links.forEach(link => {
              const linkUrl = link.link
              const title = link.title.replace(/^FACT CHECK: /, '').replace(/ - Snopes.com$/, '')
              if (linkUrl && linkUrl.startsWith('https://www.snopes.com/fact-check/')) {
                links.push({
                  url: linkUrl,
                  title
                })
              }
            })
            if (links.length > 0) {
              factChecks['snopes'] = links
              potentiallyDisputed = true
            }
            if (links.length === 25) {
              trustIndicators.negative.push({text: "High number of articles related to the headline on Snopes"})
            } else {
              trustIndicators.negative.push({text: "Some articles related to the headline on Snopes"})
            }
          }
        }
        return resolve()
      })
    }),
    new Promise(resolve => {
      google(`${structuredData.title} site:www.factcheck.org`, (err, res) => {
        if (!err) {
          if (res.links.length === 0) {
            trustIndicators.positive.push({text: "No related articles on FactCheck.org"})
          } else {
            const links = []
            res.links.forEach(link => {
              const linkUrl = link.link
              const title = link.title.replace(/ - FactCheck.org$/, '').replace(/^FactCheck.org -/, '').replace(/ site:www.factcheck.org$/, '')
              links.push({
                url: linkUrl,
                title
              })
            })
            if (links.length > 0) {
              factChecks['factcheck.org'] = links
              potentiallyDisputed = true
            }
            if (links.length === 25) {
              trustIndicators.negative.push({text: "High number of articles related to the headline on FactCheck.org"})
            } else {
              trustIndicators.negative.push({text: "Some articles related to the headline on FactCheck.org"})
            }
          }
        }
        return resolve()
      })
    })
  ])

  // If not disputed then only return one positive indicator (saying there were no negatives)
  if (potentiallyDisputed === false) {
    trustIndicators.positive = [{
      text: "No related articles found on fact checking sites",
      description: "If a story has been covered on a fact checking site the story may be known to have been misreported in the past."
    }]
  }

  return send(res, 200, {
    url,
    ...factChecks,
    trustIndicators,
    potentiallyDisputed
  })
}

async function getFacebookShareCount(url) {
  const res = await fetch(`https://graph.facebook.com/${url}`)
  const json = await res.json()
  return json.share
}