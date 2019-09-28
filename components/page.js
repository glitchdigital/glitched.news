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
      <title>Article Inspector</title>
    </Head>
    <header className="container-fluid">
      <nav className="navbar navbar-expand-md navbar-light fixed-top bg-white row border-bottom">
        <div className="col-md-3 col-lg-2">
          <Link href="/"><a className="navbar-brand text-primary">Article Inspector</a></Link>
        </div>
        <div className="col-md-9 col-lg-10 collapse navbar-collapse p-0 pr-2" id="navbarCollapse">
          {!hideInput && 
            <form className="form-inline mt-10 mt-md-10 navbar-nav mr-auto d-block w-100" onSubmit={onInputSubmit}>
              <div className="input-group">
                <input className="form-control bg-light border-0" disabled={disableInput} placeholder="e.g. http://wwww.example.com/news/2019-01-01/article" name="url" type="text" value={inputUrl} onChange={onInputChange} />
                <div className="input-group-append">
                  <button type="submit" disabled={disableInput} className="btn btn-primary">Inspect</button>
                </div>
              </div>
            </form>
          }
        </div>
      </nav>
    </header>
    { children }
  </>
)