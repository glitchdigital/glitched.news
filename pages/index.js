import React from 'react'
import Router from 'next/router'
import { Trans } from '@lingui/macro'

import Package from 'package'
import Page from 'components/page'
import Trending from 'components/trending'
import Locale from 'components/locale'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      trending: null
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.serverUrl = null // Set when page loads on client
  }

  async componentDidMount() {
    this.serverUrl = `${window.location.protocol}//${window.location.host}`

    const request = await fetch(`${this.serverUrl}/api/trending`)
    const trending = await request.json()
    this.setState({ trending })
  }

  async onSubmit(e) {
    if (e) e.preventDefault()

    let url  = null

    if (e) {
      // Handle submit from a form
      url = e.currentTarget[0].value;
      document.getElementsByName('url').forEach(el => el.value = url)
    } else {
      // If not submit from a from, grab URL from any form element named 'url'
      document.getElementsByName('url').forEach(el => {
        if (el.value && el.value !== '')
          url = el.value
      })
    }

    if (!url) {
      return;
    } else {
      const href = `/inspect?url=${url}`
      const as = href
      Router.push(href, as)
    }
  }

  render() { 
    const { trending } = this.state
    return (
      <Page hideInput={true}>
        <div className="container-fluid bg-light border-bottom pt-5 pb-5" style={{marginTop: 55}}>
          <div className="row">
            <div className="col-sm-12 col-md-10 col-lg-8 m-auto">
              <form className="form-inline mt-10 mt-md-10 text-left mr-auto" style={{width: '100%'}} onSubmit={this.onSubmit}>
                <label htmlFor="url" className="mb-1">
                  <Trans id="url_prompt">
                    Enter a news article URL to analyze
                  </Trans>
                </label>
                <input style={{width: '100%'}} className="form-control bg-white rounded-0" placeholder="e.g. http://wwww.example.com/news/2019-01-01/article" name="url" type="text" defaultValue={''} />
              </form>
              <p>
                <small>
                  <Trans id="about_prototype">
                    A prototype research tool to demonstrate how metadata and automated analysis can be combined.
                  </Trans>
                </small>
              </p>
            </div>
          </div>
        </div>

        <main className="container-fluid pt-0 mt-5 mb-5">
          <div className="row">
            <div className="col-sm-12 col-md-10 col-lg-8 m-auto">
              { trending && trending.articles && trending.articles.length > 0 &&
                <div id="trending">
                  <h6>Example recent news articles</h6>
                  <Trending trending={trending} />
                </div>
              }
              <footer>
                <hr/>
                <p className="mb-1">
                  <a target='_blank' rel='noreferrer' href='https://glitched.news'>glitched.news</a> &copy; <a target='_blank' rel='noreferrer' href='https://glitch.digital'>GLITCH.DIGITAL LIMITED</a>, {new Date().getFullYear()}
                </p>
                <p className="mb-1">
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