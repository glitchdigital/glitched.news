const { send, queryParser } = require('lib/request-handler')

module.exports = async (req, res) => {
  const query = queryParser(req)

  try {
    const locale = query.locale.replace(/[^a-zA-Z\-]+/g, '')
    // Load source for translation file and return it as a string to be executed in the client
    let i18nCatalog = await import(`raw-loader!../../locales/${locale}/messages.js`).then(mod => mod.default)
    i18nCatalog = i18nCatalog.replace('module.exports = {', 'window.i18n_catalog = {')
    return send(res, 200, { i18nCatalog })
  } catch (e) {
    // Return error if locale not found
    return send(res, 404, { error: { message: `Locale not found` } })
  }
}