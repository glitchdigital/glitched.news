import React from 'react'
import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress'

Router.onRouteChangeStart = () => NProgress.start()
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

export default ({ children }) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link rel="shortcut icon" href="/static/favicon.ico" />
      <link rel="stylesheet" href="https://cdn.rawgit.com/mblode/marx/master/css/marx.min.css" />
      <style>{`
        progress {
          border-radius: 10px; 
          width: 100%;
          height: 10px;
          background-color: #ccc;
        }
        progress::-webkit-progress-bar {
          background-color: #ccc;
          border-radius: 10px;
        }
        progress::-webkit-progress-value {
          border-radius: 10px;
          background-color: rgb(48,124,246);
        }
        progress::-moz-progress-bar {
          border-radius: 10px;
          background-color: rgb(48,124,246);
        }
      `}</style>
    </Head>
    <main>
      { children }
    </main>
  </>
)