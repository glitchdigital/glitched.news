import React from "react"
import NextApp from "next/app"
import Router from "next/router";
import withGA from "next-ga";
import { I18nProvider } from "@lingui/react"

import getCatalog from "@catalogs"

class App extends NextApp {
  static async getInitialProps({ Component, ctx }) {
    // Look for 'locale' value in query string, if none look for host header
    let locale = ctx.query.locale
    if (!locale && ctx.req && ctx.req.headers && ctx.req.headers.host) {
      locale = ctx.req.headers.host.split('.')[0]
    }

    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps, locale }
  }

  render() {
    const { Component, pageProps, locale } = this.props
    const catalog = getCatalog(locale)
    return (
      <I18nProvider language={locale} catalogs={{ [locale]: catalog }}>
        <Component {...pageProps} />
      </I18nProvider>
    )
  }
}

export default withGA('UA-92465819-3', Router)(App);