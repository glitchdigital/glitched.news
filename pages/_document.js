import NextDocument, { Head, Main, NextScript } from "next/document"

const supportedLocales = ["en", "de"]

export default class Document extends NextDocument {
  static async getInitialProps(ctx) {
    const initialProps = await NextDocument.getInitialProps(ctx)

    // Get locale from hostname (e.g. `en.example.com`, `de.example.com`, etc)
    // First locale specified in supportedLocales is the default fallback used
    const queryLocale = ctx.req.headers.host.split('.')[0]
    const locale = supportedLocales.find(l => l === queryLocale) ? queryLocale : supportedLocales[0]
    
    // Load source for current translation file and inject into page (hacky!)
    let i18n_catalog = await import(`raw-loader!../locales/${locale}/messages.js`).then(mod => mod.default)
    i18n_catalog = i18n_catalog.replace('module.exports = {', 'window.i18n_catalog = {')

    return { ...initialProps, i18n_catalog }
  }

  render() {
    const { i18n_catalog } = this.props
    return (
      <html>
        <Head>
          <script dangerouslySetInnerHTML={{ __html: i18n_catalog }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}