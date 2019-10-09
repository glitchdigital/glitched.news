import NextDocument, { Head, Main, NextScript } from 'next/document'
import { locales, defaultLocale } from '../locales'

export default class Document extends NextDocument {
  static async getInitialProps(ctx) {
    const initialProps = await NextDocument.getInitialProps(ctx)

    // Get locale from query string or hostname (e.g. `?locale=de` or `de.example.com`, etc)
    const detectedLocale = ctx.query.locale || ctx.req.headers.host.split('.')[0]
    const locale = (locales[detectedLocale]) ? detectedLocale : defaultLocale

    // Load source for translation file and inject into page
    let i18nCatalog = await import(`raw-loader!../locales/${locale}/messages.js`).then(mod => mod.default)
    i18nCatalog = i18nCatalog.replace('module.exports = {', 'window.i18n_catalog = {')

    return { ...initialProps, locale, i18nCatalog }
  }

  render() {
    const { locale, i18nCatalog } = this.props
    return (
      <html lang={locale}>
        <Head>
          <meta name="description" content="A prototype research tool to demonstrate how metadata and automated analysis can be combined."/>
          <script dangerouslySetInnerHTML={{ __html: i18nCatalog }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}