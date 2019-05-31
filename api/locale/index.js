const { send } = require('micro')
const microQuery = require('micro-query')

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', `max-age=0, s-maxage=${60 * 60 * 24}`)
  const query = microQuery(req)
  try {
    const locale = query.locale.replace(/[^a-zA-Z\-]+/g, '')
    // Load source for translation file and return it as a string to be executed in the client
    let i18nCatalog = await import(`raw-loader!../../locales/${locale}/messages.js`).then(mod => mod.default)
    i18nCatalog = i18nCatalog.replace('module.exports={', 'window.i18n_catalog = {')
    return send(res, 200, { i18nCatalog })
  } catch (e) {
    // Return error if locale not found
    return send(res, 404, { error: { message: `Locale not found` } })
  }
}