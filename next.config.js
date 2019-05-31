const withCSS = require('@zeit/next-css')
const path = require("path")

module.exports = withCSS({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]',
  },
  target: 'serverless',
  webpack(config, { isServer }) {
    config.resolve.alias = config.resolve.alias || {}
    config.resolve.alias["@catalogs$"] = path.resolve(
      __dirname,
      isServer ? "./locales/catalogs.server.js" : "./locales/catalogs.client.js"
    )
    config.node = {
      fs: "empty"
    }
    return config
  }
})