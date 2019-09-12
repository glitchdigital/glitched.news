import React from 'react'
import Head from 'next/head'
import Router from 'next/router'
import Link from 'next/link'
import NProgress from 'nprogress'

import '../css/index.css'

Router.onRouteChangeStart = () => NProgress.start()
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

export default ({ children, disableInput, inputUrl, onInputSubmit, onInputChange, hideInput }) => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link rel="shortcut icon" href="/static/favicon.ico" />
      <title>glitched.news</title>
    </Head>
    <header className="container-fluid">
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-primary row">
        <div className="col-md-3 col-lg-2">
          <Link href="/"><a className="navbar-brand">Article Inspector</a></Link>
        </div>
        <div className="col-md-9 col-lg-10 collapse navbar-collapse p-0 pr-2" id="navbarCollapse">
          {!hideInput && 
            <form className="form-inline mt-10 mt-md-10 navbar-nav mr-auto" style={{width: '100%'}} onSubmit={onInputSubmit}>
              <input style={{width: '100%'}} className="form-control border-0 rounded-0" disabled={disableInput} placeholder="e.g. http://wwww.example.com/news/2019-01-01/article" name="url" type="text" value={inputUrl} onChange={onInputChange} />
            </form>
          }
        </div>
      </nav>
    </header>
    { children }
  </>
)