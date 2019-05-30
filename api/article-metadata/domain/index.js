const { send } = require('micro')
const microQuery = require('micro-query')
const url = require('url')
const domainParser = require('effective-domain-name-parser')
const whoisLookup = require('whois-promise')
const moment = require('moment')
const sslCertificate = require('get-ssl-certificate')

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', `max-age=60, s-maxage=${60 * 60}`)
  
  const query = microQuery(req)

  let domain = ''

  const indicators = { positive: [], negative: [] }

  if (query.url) {
    const urlParts = url.parse(query.url)
    const domainParts = domainParser.parse(urlParts.hostname)
    domain = `${domainParts.sld}.${domainParts.tld}`
  } else if (query.domain) {
    domain = query.domain
  } else {
    return send(res, 400, { error: 'URL or domain parameter required' })
  }

  const whois = await whoisLookup.json(domain)

  if (whois.registrantOrganization) {
    if (!whois.registrantOrganization.toLowerCase().includes('redacted')) {
      indicators.positive.push({text: "Domain has information about the owner"})
    } else {
      indicators.negative.push({text: "Domain owner information redacted"})
    }

    if (whois.registrantStreet && whois.registrantCity && whois.registrantCountry) {
      if (!whois.registrantStreet.toLowerCase().includes('redacted') &&
          !whois.registrantCity.toLowerCase().includes('redacted') &&
          !whois.registrantCountry.toLowerCase().includes('redacted') ) {
        indicators.positive.push({text: "Domain has owner has address listed"})
      } else {
        indicators.negative.push({text: "Domain owner address redacted"})
      }
    } else {
      indicators.negative.push({text: "Domain owner address not found"})
    }
  } else {
    if (whois.registrantStreet && whois.registrantCity && whois.registrantCountry) {
      if (!whois.registrantStreet.toLowerCase().includes('redacted') &&
          !whois.registrantCity.toLowerCase().includes('redacted') &&
          !whois.registrantCountry.toLowerCase().includes('redacted') ) {
        indicators.positive.push({text: "Domain has owner has address listed"})
      } else {
        indicators.negative.push({text: "Domain owner address redacted"})
      }
    } else {
      indicators.negative.push({text: "Unable to identify the domain owner"})
    }
  }

  if (whois.creationDate) {
    const dateRegistered = moment.utc(whois.creationDate)
    const dateNow = moment()
    const yearsAgo = dateNow.diff(dateRegistered, 'years')
    if (yearsAgo > 10) {
      indicators.positive.push({text: `Domain is not new (registered ${dateRegistered.fromNow()})`})
    } else if (yearsAgo < 5) {
      if (yearsAgo > 2) {
        indicators.negative.push({text: `Domain is quite new (registered ${dateRegistered.fromNow()})`})
      } else {
        indicators.negative.push({text: `Domain is very new (registered ${dateRegistered.fromNow()})`})
      }
    }
  } else {
    indicators.negative.push({text: "Unable to identify when the domain was registered"})
  }

  // SSL Certificate information is mostly useless as so few sites have detailed / accurate information
  const rawCertificate = await sslCertificate.get(domain)
  let certificate = {}
  if (rawCertificate) {
    if (rawCertificate.subject) {
      certificate.subject = {}
      if (rawCertificate.subject.C) certificate.country = rawCertificate.subject.C
      if (rawCertificate.subject.ST) certificate.region = rawCertificate.subject.ST
      if (rawCertificate.subject.L) certificate.location = rawCertificate.subject.L
      if (rawCertificate.subject.O) certificate.owner = rawCertificate.subject.O
      if (rawCertificate.subject.CN) certificate.issuer = rawCertificate.subject.CN
    }
  }
 
  return send(res, 200, {
    domain,
    whois,
    certificate,
    indicators
  })
}