import React from "react"
import Router from 'next/router'
import { Trans } from "@lingui/macro"

import Package from '../package'
import Page from '../components/page'
import Locale from '../components/locale'
import Trending from '../components/trending'
import Trust from '../components/trust'
import Headline from '../components/article-metadata/headline'
import Content from '../components/article-metadata/content'
import Website from '../components/article-metadata/website'
import FactChecks from '../components/article-metadata/factchecks'
import Social from '../components/article-metadata/social'
import Sentiment from '../components/article-metadata/sentiment'
import Topics from '../components/article-metadata/topics'
import Related from '../components/article-metadata/related'
import Links from '../components/article-metadata/links'
import Blacklists from '../components/article-metadata/blacklists'

export default class extends React.Component {
  static async getInitialProps({ query }) {
    return {
      articleUrl: query.url
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      articleUrl: props.articleUrl || null,
      articleMetadata: {
        domain: null,
        hosting: null,
        content: null,
        social: null,
        topics: null,
        related: null,
        factchecks: null,
        blacklists: null
      },
      trending: null,
      indicators: {
        positive: [],
        negative: []
      },
      inProgress: false
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.serverUrl = null // Set when page loads on client
  }

  async componentDidMount() {
    this.serverUrl = `${window.location.protocol}//${window.location.host}`

    if (this.state.articleUrl) {
      this.onSubmit()
    } else {
      const request = await fetch(`${this.serverUrl}/api/trending`)
      const trending = await request.json()
      this.setState({ trending })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.articleUrl !== prevProps.articleUrl) {
      let articleUrl = this.props.articleUrl || null

      // Add protocol to URL if none specified
      if (articleUrl && !articleUrl.includes('//')) {
        articleUrl = 'https://'+articleUrl
      }

      document.getElementById('url').value = articleUrl
      this.onSubmit()
    }
  }

  async onSubmit(e) {
    if (e) e.preventDefault()

    let articleUrl = null

    if (!document.getElementById('url').value) {
      // Reset URL browser address bar
      Router.push('/', '/', {})
    } else {
      // Update URL browser address bar to reflect it has a URL
      articleUrl = document.getElementById('url').value
      document.getElementById('url').className = 'animated rubberBand'

      // Add protocol to URL if none specified
      if (articleUrl && !articleUrl.includes('//')) {
        articleUrl = 'https://'+articleUrl
        document.getElementById('url').value = articleUrl
      }

      const href = `/?url=${articleUrl}`
      const as = href
      Router.push(href, as, { shallow: true })
    }

    // Reset state
    this.setState({
      articleUrl: articleUrl,
      articleMetadata: {
        domain: null,
        hosting: null,
        content: null,
        social: null,
        topics: null,
        related: null,
        factchecks: null,
        blacklists: null
      },
      indicators: {
        positive: [],
        negative: []
      },
      inProgress: (articleUrl) ? true : false
    })

    // If we have a URL, get article metadata
    if (articleUrl) {
      /*
      const request = await fetch(`${this.serverUrl}/api/article-metadata?url=${articleUrl}`
      const articleMetadata = await request.json()
      this.setState({
        articleMetadata,
        inProgress: false
      })
      */
      this.eventSource = new EventSource(`${this.serverUrl}/api/article-metadata?url=${articleUrl}&stream=true`)
      this.eventSource.addEventListener('message', event => {
        // Update state with latest data
        const eventData = JSON.parse(event.data)
        let articleMetadata = this.state.articleMetadata
        articleMetadata[eventData.endpoint] = eventData.data
        
        const indicators = { positive: [], negative: [] }
        for (let prop in articleMetadata) {
          if (articleMetadata[prop] !== null) {
            // Get positive and negative indicators in each section
            // (Looping over like this preserves the order of them)
            if (articleMetadata[prop].indicators) {
              indicators.positive = indicators.positive.concat(articleMetadata[prop].indicators.positive)
              indicators.negative = indicators.negative.concat(articleMetadata[prop].indicators.negative)
            }
          }
        }
        
        this.setState({
          articleMetadata,
          indicators,
          inProgress: eventData.inProgress
        })
    
        // If data complete close event source
        if (eventData.inProgress !== true) {
          this.eventSource.close()
          document.getElementById('url').className = ''
        }
      })
      this.eventSource.addEventListener('error', event => {
        this.eventSource.close()
        this.setState({ inProgress: false })
        document.getElementById('url').className = ''
      })
    }
  }

  render() { 
    const { articleUrl, articleMetadata, inProgress, indicators, trending } = this.state

    return (
      <Page>
        <Locale/>
        <form id="url-form" onSubmit={this.onSubmit} style={{margin: 0, overflow: 'hidden'}}>
          <label style={{fontWeight: 600}} htmlFor="url">
            <Trans id="url_prompt">
              Enter a news article URL to analyze
            </Trans>
          </label>
          <input disabled={inProgress} placeholder="e.g. http://wwww.example.com/news/2019-01-01/article" style={{fontSize: '.9em'}} id="url" name="url" type="text" defaultValue={articleUrl || ''} />
          <p>
            <small>
              <Trans id="about_prototype">
                A prototype research tool to demonstrate how metadata and automated analysis can be combined.
              </Trans>
            </small>
          </p>
          { inProgress && (
            <div className="">
          <div className="spinner">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45"/>
            </svg>
          </div>
          </div>
          )}
        </form>
        { !articleUrl && trending && trending.articles && trending.articles.length > 0 && <Trending trending={trending} /> }
        { articleMetadata.content && <Headline content={articleMetadata.content} /> }
        { (indicators.positive.length > 0 || indicators.negative.length > 0) && <Trust indicators={indicators} /> }
        { articleMetadata.blacklists && <Blacklists content={articleMetadata.blacklists} /> }
        { articleMetadata.content && <Content content={articleMetadata.content} /> }
        { articleMetadata.hosting && articleMetadata.domain && <Website hosting={articleMetadata.hosting} domain={articleMetadata.domain} /> }
        { articleMetadata.social && articleMetadata.social.facebook && <Social social={articleMetadata.social} /> }
        { articleMetadata.content && <Sentiment content={articleMetadata.content} /> }
        { articleMetadata.content && articleMetadata.factchecks && <FactChecks factchecks={articleMetadata.factchecks} content={articleMetadata.content} /> }
        { articleMetadata.topics && articleMetadata.topics && <Topics topics={articleMetadata.topics} /> }
        { articleMetadata.related && articleMetadata.related && <Related related={articleMetadata.related} /> }
        { articleMetadata.content && articleMetadata.content.links && <Links links={articleMetadata.content.links} /> }
        <hr/>
        <p className="footer">
          <small>
            <a href="https://glitched.news">glitched.news</a> &copy; <a href="https://glitch.digital">GLITCH DIGITAL LIMITED</a>, 2019.
            Version {Package.version}.
            {' '}
            <a target="_blank" href="https://github.com/glitchdigital/glitched.news">
              Open source (ISC License).
            </a>
          </small>
        </p>
      </Page>
    )
  }
}