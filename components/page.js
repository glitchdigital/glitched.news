import React from 'react'
import Head from 'next/head'
import Router from 'next/router'
import NProgress from 'nprogress'
import Package from 'package'
import Locale from 'components/locale'

import '../css/index.css'

Router.onRouteChangeStart = () => NProgress.start()
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

export default ({ children }) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link rel="shortcut icon" href="/static/favicon.ico" />
      <title>glitched.news</title>
    </Head>
    { children }
    {/*
    <footer>
      <p>
        <a target='_blank' rel='noreferrer' href='https://glitched.news'>glitched.news</a> &copy; <a target='_blank' rel='noreferrer' href='https://glitch.digital'>GLITCH.DIGITAL LIMITED</a>, {new Date().getFullYear()}
      </p>
      <p>
        Version {Package.version}.
        {' '}
        <a target='_blank' rel='noreferrer' href='https://github.com/glitchdigital/glitched.news'>
          Open source (ISC License)  
        </a>
      </p>
      <Locale/>
    </footer>
    */}
  </>
)