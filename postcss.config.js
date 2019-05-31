const postcssImport = require('postcss-import')
const postcssNested = require('postcss-nested')
const cssNano = require('cssnano')

module.exports = {
  plugins: [
    postcssImport(),
    postcssNested(),
    cssNano({ preset: ['default'] })
  ],
}
