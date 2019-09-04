import React from "react"
import Router from 'next/router'
import { Trans } from "@lingui/macro"

import Page from '../components/page'
import Sidebar from 'components/sidebar'
import Loader from '../components/loader'
import UrlInput from '../components/url-input'
import Trending from '../components/trending'
import Trust from '../components/trust'
import Headline from '../components/article-metadata/headline'
import Content from '../components/article-metadata/content'
import Website from '../components/article-metadata/website'
import FactCheck from '../components/article-metadata/factcheck'
import Social from '../components/article-metadata/social'
import Sentiment from '../components/article-metadata/sentiment'
import Topics from '../components/article-metadata/topics'
import Related from '../components/article-metadata/related'
import Links from '../components/article-metadata/links'
import Blacklists from '../components/article-metadata/blacklists'
import StructuredData from '../components/article-metadata/structured-data'

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
        blacklists: null,
        'structured-data': null
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
    }

    const request = await fetch(`${this.serverUrl}/api/trending`)
    const trending = await request.json()
    this.setState({ trending })

    if (!window.hashchangeEventListenerAdded) {
      window.hashchangeEventListenerAdded = true
      window.addEventListener("hashchange", function () {
        window.scrollTo(window.scrollX, window.scrollY - 40)
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.articleUrl !== prevProps.articleUrl) {
      let articleUrl = this.props.articleUrl || null

      // Add protocol to URL if none specified
      if (articleUrl && !articleUrl.includes('//')) {
        articleUrl = 'https://'+articleUrl
      }

      document.getElementsByName('url').forEach(el => el.value = articleUrl)
      this.onSubmit()
    }
  }

  async onSubmit(e) {
    if (e) e.preventDefault()

    let articleUrl = null
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
      // Reset URL browser address bar
      Router.push('/', '/', { shallow: true })
    } else {
      // Update URL browser address bar to reflect it has a URL
      articleUrl = url

      // Add protocol to URL if none specified
      if (articleUrl && !articleUrl.includes('//')) {
        articleUrl = 'https://'+articleUrl
        document.getElementsByName('url').forEach(el => el.value = articleUrl)
      }
      const href = `${window.location.pathname}?url=${articleUrl}`
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
        blacklists: null,
        'structured-data': null,
      },
      indicators: {
        positive: [],
        negative: []
      },
      inProgress: (articleUrl) ? true : false
    })

    // If we have a URL, get article metadata
    if (articleUrl) {
      // Server Side Events are experimental feature for now
      // as it's proving slightly slower than just using REST
      // and the streaming of events isn't working as intended
      // (output is being buffered but shouldn't be).
      const ENABLE_SERVER_SIDE_EVENTS = false
      if (ENABLE_SERVER_SIDE_EVENTS && typeof(EventSource) !== 'undefined') {
        // Use Server Side Events (EventSource) if the browser supports them
        this.eventSource = new EventSource(`${this.serverUrl}/api/article-metadata?url=${articleUrl}&stream=true`)
        this.eventSource.addEventListener('message', event => {
          // Update state with latest data
          const eventData = JSON.parse(event.data)
          let articleMetadata = this.state.articleMetadata
          articleMetadata[eventData.endpoint] = eventData.data
          const indicators = this.getTrustIndicators(articleMetadata)
          
          this.setState({
            articleMetadata,
            indicators,
            inProgress: eventData.inProgress
          })
      
          // If data complete close event source
          if (eventData.inProgress !== true) {
            this.eventSource.close()
          }
        })
        this.eventSource.addEventListener('error', event => {
          this.eventSource.close()
          this.setState({ inProgress: false })
        })
      } else {
        // If the browser doesn't support EventSource (Server Side Events) use REST API
        // (This is really just Internet Explorer - including Edge!)
        const request = await fetch(`${this.serverUrl}/api/article-metadata?url=${articleUrl}`)
        const articleMetadata = await request.json()
        const indicators = this.getTrustIndicators(articleMetadata)

        this.setState({
          articleMetadata,
          indicators,
          inProgress: false
        })
      }
    }
  }

  getTrustIndicators(articleMetadata) {
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
    return indicators 
  }

  render() { 
    const { articleUrl, articleMetadata, inProgress, indicators, trending } = this.state

    return (
      <Page>
        <header className="container-fluid">
          <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark row">
            <div className="col-md-3">
              <a className="navbar-brand" href="/">GLITCHED.NEWS</a>
            </div>
            <div className="col-md-9 collapse navbar-collapse" id="navbarCollapse">
              <form className="form-inline mt-10 mt-md-0 navbar-nav mr-auto" style={{width: '100%'}} onSubmit={this.onSubmit}>
                <input style={{width: '100%'}} className="form-control" disabled={inProgress} placeholder="e.g. http://wwww.example.com/news/2019-01-01/article" name="url" type="text" defaultValue={articleUrl || ''} />
              </form>
            </div>
          </nav>
        </header>
        
        <div className="d-none d-md-block">{ inProgress && <div className="pt-5"><Loader/></div> }</div>

        <div className="container-fluid">
          <div className="row">
            { articleUrl && !inProgress &&
              <nav className="col-md-3 d-none d-md-block bg-light sidebar">
                <Sidebar/>
              </nav>
            }
            <main role="main" className="col-md-9 ml-sm-auto">
              <form className="form-inline d-md-none mb-3" style={{width: '100%'}} onSubmit={this.onSubmit}>
                <input style={{width: '100%'}} className="form-control" disabled={inProgress} placeholder="e.g. http://wwww.example.com/news/2019-01-01/article" name="url" type="text" defaultValue={articleUrl || ''} />
              </form>
              <div className="d-block d-md-none">{ inProgress && <Loader/> }</div>
              <div id="trending">
                { !articleUrl && trending && trending.articles && trending.articles.length > 0 && <Trending trending={trending} /> }
              </div>
              <div id="article-summary">
                { articleMetadata.content && <Headline content={articleMetadata.content} /> }
                { articleMetadata.content && <Content content={articleMetadata.content} /> } 
                { articleMetadata.blacklists && <Blacklists content={articleMetadata.blacklists} /> }
                { articleMetadata.hosting && articleMetadata.domain && <Website hosting={articleMetadata.hosting} domain={articleMetadata.domain} /> }
              </div>
              <div id="article-trust">
                { (indicators.positive.length > 0 || indicators.negative.length > 0) && <Trust indicators={indicators} /> }
              </div>
              <div id="article-sentiment">
                { articleMetadata.content && <Sentiment content={articleMetadata.content} /> }
              </div>
              <div id="article-factcheck"> 
                { articleMetadata.content && articleMetadata.factchecks && <FactCheck factchecks={articleMetadata.factchecks} content={articleMetadata.content} /> }
              </div>
              <div id="article-topics">
                { articleMetadata.topics && <Topics topics={articleMetadata.topics} /> }
              </div>
              <div id="article-social"> 
                { articleMetadata.social && articleMetadata.social.facebook && <Social social={articleMetadata.social} /> }
              </div>
              <div id="article-structured-data"> 
                { articleMetadata['structured-data'] && articleMetadata['structured-data'].testResults && <StructuredData testResults={articleMetadata['structured-data'].testResults} /> }
              </div>
              <div id="article-links"> 
                { articleMetadata.content && articleMetadata.content.links && <Links links={articleMetadata.content.links} /> }
              </div>
              <div id="article-related"> 
                { articleMetadata.related && <Related related={articleMetadata.related} /> }
              </div> 
            </main>
          </div>
        </div>
      </Page>
    )
  }
}