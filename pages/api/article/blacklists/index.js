const domainParser = require('effective-domain-name-parser')
const urlParser = require('url')
const csvString = require('csv-string')

const { send, queryParser } = require('lib/request-handler')
const dailydot = require('./dailydot')
const politifact = require('./politifact')

module.exports = async (req, res) => {
  const { url } = queryParser(req)

  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })

  const trustIndicators = { positive: [], negative: [] }
  const urlParts = urlParser.parse(url)
  const domainParts = domainParser.parse(urlParts.hostname)
  const domain = domainParts.tld === 'localhost' ? 'localhost' : `${domainParts.sld}.${domainParts.tld}`.toLowerCase()

  let blacklists = []

  blacklistChecks = await Promise.all([
    checkDailyDot(domain, trustIndicators, blacklists),
    checkPolitifact(domain, trustIndicators, blacklists)
  ])

  if (blacklists.length === 0) {
    trustIndicators.positive.push({
      text: 'Not found on any blacklists',
      description: 'This website is not listed on blacklists of sites known to publish false news.'
    })
  }
  
  return send(res, 200, {
    url,
    domain,
    blacklists,
    trustIndicators
  })
}

async function checkDailyDot(domain, trustIndicators, blacklists) {
  let foundOnBlacklist = false
  const csvData = await csvString.parse(dailydot.csv)
  csvData.forEach(row => {
    const domainListed = row[0].toLowerCase()
    if (domainListed === domain) {
      trustIndicators.negative.push({ 
        text: `Flagged by The Daily Dot`,
        description: `The Daily Dot has flagged ${domain}`
      })
      foundOnBlacklist = true
    }
  })
  if (foundOnBlacklist) {
    blacklists.push('The Daily Dot')
  }
  return Promise.resolve(foundOnBlacklist)
}

async function checkPolitifact(domain, trustIndicators, blacklists) {
  let foundOnBlacklist = false
  const csvData = await csvString.parse(politifact.csv)
  csvData.forEach(row => {
    const domainListed = row[0].toLowerCase()
    const reasonListed = (row[1]) ? row[1].toLowerCase() : null
    if (domainListed === domain) {
      if (reasonListed) {
        trustIndicators.negative.push({ 
          text: 'Flagged by Politifact',
          description: `Politifact has flagged ${domain} as "${reasonListed}"`
        })
      } else {
        trustIndicators.negative.push({ 
          text: 'Flagged by Politifact',
          description: `Politifact has flagged ${domain}`
        })
      }
      foundOnBlacklist = true
    }
  })
  if (foundOnBlacklist) {
    blacklists.push('Politifact')
  }
  return Promise.resolve(foundOnBlacklist)
}