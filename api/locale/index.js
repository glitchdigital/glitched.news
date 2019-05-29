const { send } = require('micro')
const microQuery = require('micro-query')
const { locales, defaultLocale } = require('../../locales')

module.exports = async (req, res) => {
  const query = microQuery(req)

  const detectedLocale = query.locale
  const locale = (locales[detectedLocale]) ? detectedLocale : defaultLocale

  // Load source for translation file and return it as a string to be executed in the client
  let i18nCatalog = await import(`raw-loader!../../locales/${locale}/messages.js`).then(mod => mod.default)
  i18nCatalog = i18nCatalog.replace('module.exports={', 'window.i18n_catalog = {')

  return send(res, 200, {
    i18nCatalog
  })
}