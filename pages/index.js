import React from 'react'
import Router from 'next/router'
import { Trans } from '@lingui/macro'

import Package from 'package'
import Page from 'components/page'
import Locale from 'components/locale'

import 'css/home.css'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      trending: null,
      url: ''
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.serverUrl = null // Set when page loads on client
  }

  async componentDidMount() {
    this.serverUrl = `${window.location.protocol}//${window.location.host}`
    /*
    const request = await fetch(`${this.serverUrl}/api/trending`)
    const trending = await request.json()
    this.setState({ trending })
    */
  }

  onChange(event) {
    this.setState({ url: event.target.value })
  }

  async onSubmit(event) {
    if (event) event.preventDefault()

    const url  = this.state.url
    
    if (!url || url.trim() === '') {
      return;
    } else {
      const href = `/article?url=${url}`
      const as = href
      Router.push(href, as)
    }
  }

  render() { 
    const { url, trending } = this.state
    return (
      <Page hideInput={true}>
        <div className="container-fluid home__jumbotron">
          <div className="home__jumbotron-background bg-primary">
            <div className="home__jumbotron-background-image"/>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-10 col-lg-8 m-auto">
              <h3 className="text-white">
                <Trans id="inspect_article">Inspect an article</Trans>
              </h3>
              <form className="form rounded shadow bg-white mt-md-10 text-left mr-auto w-100" onSubmit={this.onSubmit}>  
                <label htmlFor="home-url" className="mb-1">
                  <Trans id="url_prompt">Enter a news article URL to analyze</Trans>
                </label>
                <div className="input-group">
                  <input id="home-url" autoFocus={true} className="form-control bg-light border-0" placeholder="e.g. http://wwww.example.com/news/2019-01-01/article" name="url" type="text" defaultValue={url} onChange={this.onChange} />
                  <div className="input-group-append">
                    <button type="submit" className="btn btn-primary">Inspect</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <main className="container-fluid pt-0 mt-5 mb-5">
          <div className="row">
            <div className="col-xs-12 col-sm-7 col-md-6 col-lg-12 m-auto">
              <h5 className="text-primary font-weight-light text-center mt-5 mb-5">
                <Trans id="about_prototype">
                  A prototype research tool that combines article metadata and automated analysis
                </Trans>
              </h5>
              <footer className="text-center text-muted">
                <p className="mb-1">
                  <a className="text-muted" target='_blank' rel='noreferrer' href='https://glitch.digital'>&copy; GLITCH.DIGITAL LIMITED, {new Date().getFullYear()}</a>
                </p>
                <p>
                  <a className="text-muted" target='_blank' rel='noreferrer' href='https://github.com/glitchdigital/glitched.news'>
                    Version {Package.version}.
                    Open source (ISC License)  
                  </a>
                </p>
                <Locale/>
              </footer>
            </div>
          </div>
        </main>
      </Page>
    )
  }
}