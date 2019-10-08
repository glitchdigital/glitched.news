const { structuredDataTestHtml } = require('structured-data-testing-tool')
const { Google, SocialMedia } = require('structured-data-testing-tool/presets')
const { groupTestResults } = require('structured-data-testing-tool/lib/group-test-results')

const { send, queryParser } = require('lib/request-handler')
const { parseHtmlFromUrl } = require('lib/parse-html')

module.exports = async (req, res) => {
  const { url } = queryParser(req)
  
  if (!url)
    return send(res, 400, { error: 'URL parameter missing' })

  const { html } = req.locals ? req.locals : await parseHtmlFromUrl(url)
  
  const trustIndicators = { positive: [], negative: [] }

  const testResults = await structuredDataTestHtml(html, { presets: [ Google, SocialMedia ]})
  .then(res => res )
  .catch(err => err.res)

  const responseData = {
    url,
    trustIndicators,
    testResults: {
      passed: testResults.passed.length,
      info: testResults.info.length,
      warnings: testResults.warnings.length,
      failed: testResults.failed.length,
      groups: groupTestResults(testResults.tests)
    }
  }

  if (req.locals && req.locals.useStreamingResponseHandler) {
    return Promise.resolve(responseData)
  } else {
    return send(res, 200, responseData)
  }
}