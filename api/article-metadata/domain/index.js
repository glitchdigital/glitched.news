const urlParser = require('url')
const domainParser = require('effective-domain-name-parser')
const whoisLookup = require('whois-promise')
const moment = require('moment')
const sslCertificate = require('get-ssl-certificate')

const { send, queryParser } = require('../../../lib/request-handler')

module.exports = async (req, res) => {
  const { url } = queryParser(req)

  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })

  const indicators = { positive: [], negative: [] }
  const urlParts = urlParser.parse(url)
  const domainParts = domainParser.parse(urlParts.hostname)
  const domain = `${domainParts.sld}.${domainParts.tld}`

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
        indicators.positive.push({text: "Domain owner has address listed"})
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
        indicators.positive.push({text: "Domain owner has address listed"})
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
    url,
    domain,
    whois,
    certificate,
    indicators
  })
}
