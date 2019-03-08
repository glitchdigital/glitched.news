import { Fragment } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress'

Router.onRouteChangeStart = () => NProgress.start()
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

export default ({ children }) => (
  <Fragment>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link rel="shortcut icon" href="/static/favicon.ico" />
      <link rel="stylesheet" href="https://cdn.rawgit.com/mblode/marx/master/css/marx.min.css" />
    </Head>
    <main>
      { children }
    </main>
  </Fragment>
)