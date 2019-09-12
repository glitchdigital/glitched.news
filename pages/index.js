import React from 'react'
import Router from 'next/router'
import { Trans } from '@lingui/macro'

import Package from 'package'
import Page from 'components/page'
import Trending from 'components/trending'
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
    const request = await fetch(`${this.serverUrl}/api/trending`)
    const trending = await request.json()
    this.setState({ trending })
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
      const href = `/inspect?url=${url}`
      const as = href
      Router.push(href, as)
    }
  }

  render() { 
    const { url, trending } = this.state
    return (
      <Page hideInput={true}>
        <div className="container-fluid home__jumbotron">
          <div className="home__jumbotron-background"/>
          <div className="row">
            <div className="col-sm-12 col-md-10 col-lg-8 m-auto">
              <h1 className="display-4 text-primary">Inspect an article</h1>
              <form className="form border rounded shadow bg-white form-inline mt-md-10 text-left mr-auto w-100" onSubmit={this.onSubmit}>  
                <label htmlFor="url" className="mb-1">
                  <Trans id="url_prompt">
                    Enter a news article URL to analyze
                  </Trans>
                </label>
                <input className="rounded form-control bg-white rounded-0 w-100" placeholder="e.g. http://wwww.example.com/news/2019-01-01/article" name="url" type="text" value={url} onChange={this.onChange} />
                <p>
                  <small className="text-muted">
                    <Trans id="about_prototype">
                      A prototype research tool to demonstrate how metadata and automated analysis can be combined.
                    </Trans>
                  </small>
                </p>
              </form>
            </div>
          </div>
        </div>
        <main className="container-fluid pt-0 mt-5 mb-5">
          <div className="row">
            <div className="col-sm-12 col-md-10 col-lg-8 m-auto">
              { trending && trending.articles && trending.articles.length > 0 &&
                <div id="trending" className="mb-5">
                  <h6>Example recent news articles</h6>
                  <Trending trending={trending} />
                </div>
              }
              <footer className="text-center text-muted">
                <p className="mb-1">
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
            </div>
          </div>
        </main>
      </Page>
    )
  }
}