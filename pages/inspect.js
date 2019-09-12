import React from 'react'
import Router from 'next/router'

import Page from 'components/page'
import Sidebar from 'components/sidebar'
import Loader from 'components/loader'
import Trust from 'components/trust'
import Headline from 'components/article-metadata/headline'
import Content from 'components/article-metadata/content'
import Website from 'components/article-metadata/website'
import FactCheck from 'components/article-metadata/factcheck'
import Social from 'components/article-metadata/social'
import Sentiment from 'components/article-metadata/sentiment'
import Topics from 'components/article-metadata/topics'
import Related from 'components/article-metadata/related'
import Links from 'components/article-metadata/links'
import Blacklists from 'components/article-metadata/blacklists'
import StructuredData from 'components/article-metadata/structured-data'

const DEFAULT_SECTION = 'article-summary'
// Server Side Events are an experimental feature for now
// as it's proving slightly slower than just using REST
// and the streaming of events isn't working as intended
// (output is being buffered when it shouldn't be).
const ENABLE_SERVER_SIDE_EVENTS = false

export default class extends React.Component {
  static async getInitialProps({ query }) {
    return {
      articleUrl: query.url
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      url: props.articleUrl || '',
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
      indicators: {
        positive: [],
        negative: []
      },
      inProgress: false,
      currentSection: DEFAULT_SECTION
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.toggleSection = this.toggleSection.bind(this)
    this.serverUrl = null // Set when page loads on client
  }

  async componentDidMount() {
    this.serverUrl = `${window.location.protocol}//${window.location.host}`

    if (this.state.url) {
      this.onSubmit()
    }

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

      this.setState({ url: articleUrl })
      this.onSubmit()
    }
  }

  onChange(event) {
    this.setState({ url: event.target.value })
  }

  async onSubmit(e) {
    if (e) e.preventDefault()

    let url  = this.state.url

    if (!url) {
      // Reset URL browser address bar
      Router.push('/', '/', { shallow: true })
    } else {
      // Add protocol to URL if none specified
      if (!url.includes('//')) {
        url = `https://${url}`
      }
      const href = `${window.location.pathname}?url=${url}`
      const as = href
      Router.push(href, as, { shallow: true })
    }

    // Reset state
    this.setState({
      url,
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
      inProgress: (url) ? true : false,
      currentSection: DEFAULT_SECTION
    })

    // Reset section highlighting
    Array.prototype.slice.call(document.getElementsByTagName('section')).map(el => el.className = '')
    document.getElementById(DEFAULT_SECTION).className = 'd-block'

    // If we have a URL, get article metadata
    if (url) {
      if (ENABLE_SERVER_SIDE_EVENTS && typeof(EventSource) !== 'undefined') {
        // Use Server Side Events (EventSource) if the browser supports them
        this.eventSource = new EventSource(`${this.serverUrl}/api/article-metadata?url=${url}&stream=true`)
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

          // If data complete then close event source
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
        const request = await fetch(`${this.serverUrl}/api/article-metadata?url=${url}`)
        const articleMetadata = await request.json()
        const indicators = this.getTrustIndicators(articleMetadata)

        this.setState({
          articleMetadata,
          indicators,
          inProgress: false,
          currentSection: DEFAULT_SECTION
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

  toggleSection(e) {
    e.preventDefault()
    const currentSection = e.target.getAttribute('href').replace('#', '')
    Array.prototype.slice.call(document.getElementsByTagName('section')).map(el => el.className = '')
    document.getElementById(currentSection).className = 'd-block'
    this.setState({currentSection})
  }

  render() { 
    const { currentSection, url, articleMetadata, inProgress, indicators } = this.state

    return (
      <Page inputUrl={url} onInputSubmit={this.onSubmit} onInputChange={this.onChange} disableInput={inProgress}>
        <main role="main">
          <div className="d-none d-md-block">{ inProgress && <div className="pt-5"><Loader/></div> }</div>
          <div className="container-fluid">
            <div className="row">
              <form className="form-inline d-md-none mb-3 pl-2 pr-2 w-100" onSubmit={this.onSubmit}>
                <input className="form-control rounded-0 w-100" disabled={inProgress} placeholder="e.g. http://wwww.example.com/news/2019-01-01/article" name="url" type="text" value={url} onChange={this.onChange} />
              </form>
              { url && !inProgress &&
                <div className="col-md-3 col-lg-2 d-none d-md-block sidebar bg-light">
                  <Sidebar currentSection={currentSection} onClickHandler={this.toggleSection} />
                </div>
              }
              <div className="col-md-9 col-lg-10 ml-sm-auto article">
                <div className="d-block d-md-none">{ inProgress && <Loader/> }</div>
                <section id="article-summary">
                  { articleMetadata.content && <Headline content={articleMetadata.content} /> }
                  { articleMetadata.content && <Content content={articleMetadata.content} /> } 
                  { articleMetadata.blacklists && <Blacklists content={articleMetadata.blacklists} /> }
                  { articleMetadata.hosting && articleMetadata.domain && <Website hosting={articleMetadata.hosting} domain={articleMetadata.domain} /> }
                </section>
                <section id="article-trust">
                  { (indicators.positive.length > 0 || indicators.negative.length > 0) && <Trust indicators={indicators} /> }
                </section>
                <section id="article-sentiment">
                  { articleMetadata.content && <Sentiment content={articleMetadata.content} /> }
                </section>
                <section id="article-factcheck"> 
                  { articleMetadata.content && articleMetadata.factchecks && <FactCheck factchecks={articleMetadata.factchecks} content={articleMetadata.content} /> }
                </section>
                <section id="article-topics">
                  { articleMetadata.topics && <Topics topics={articleMetadata.topics} /> }
                </section>
                <section id="article-social"> 
                  { articleMetadata.social && articleMetadata.social.facebook && <Social social={articleMetadata.social} /> }
                </section>
                <section id="article-structured-data"> 
                  { articleMetadata['structured-data'] && articleMetadata['structured-data'].testResults && <StructuredData testResults={articleMetadata['structured-data'].testResults} /> }
                </section>
                <section id="article-links"> 
                  { articleMetadata.content && articleMetadata.content.links && <Links links={articleMetadata.content.links} /> }
                </section>
                <section id="article-related"> 
                  { articleMetadata.related && <Related related={articleMetadata.related} /> }
                </section> 
              </div>
            </div>
          </div>
        </main>
      </Page>
    )
  }
}