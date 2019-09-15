const fetch = require('node-fetch')
const { structuredDataTestHtml } = require('structured-data-testing-tool')
const { Google, SocialMedia } = require('structured-data-testing-tool/presets')
const { groupTestResults } = require('structured-data-testing-tool/lib/group-test-results')

const { send, queryParser } = require('lib/request-handler')
const fetchOptions = require('lib/fetch-options')

module.exports = async (req, res) => {
  const { url } = queryParser(req)
  
  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })

  const trustIndicators = { positive: [], negative: [] }

  const fetchRes = await fetch(encodeURI(url), fetchOptions)
  const html = await fetchRes.text()
  const testResults = await structuredDataTestHtml(html, { presets: [ Google, SocialMedia ]})
  .then(res => res )
  .catch(err => err.res)

  return send(res, 200, {
    url,
    trustIndicators,
    testResults: {
      passed: testResults.passed.length,
      info: testResults.info.length,
      warnings: testResults.warnings.length,
      failed: testResults.failed.length,
      groups: groupTestResults(testResults.tests)
    }
  })
}