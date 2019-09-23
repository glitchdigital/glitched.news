import React from 'react'
import Router from 'next/router'

import Page from 'components/page'
import Sidebar from 'components/sidebar'
import Loader from 'components/loader'
import Trust from 'components/trust'
import Homepage from 'components/homepage'
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
      articleUrl: query.url,
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
        text: null,
        homepage: null,
        links: null,
        'structured-data': null
      },
      trustIndicators: {
        positive: [],
        negative: []
      },
      feedback: [],
      inProgress: false,
      currentSection: null
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.toggleSection = this.toggleSection.bind(this)
    this.serverUrl = null // Set when page loads on client
  }

  async componentDidMount() {
    this.serverUrl = `${window.location.protocol}//${window.location.host}`

    const currentSection = this.getCurrentSectionFromLocation()
    this.setState({ currentSection }, () => {
      if (this.state.url) {
        this.onSubmit()
      }
    })

    if (!window.hashchangeEventListenerAdded) {
      window.hashchangeEventListenerAdded = true
      window.addEventListener('hashchange', () => {
        window.scrollTo(window.scrollX, window.scrollY - 40)
        this.toggleSection()
      })
    }
  }

  getCurrentSectionFromLocation() {
    return window.location.hash ? window.location.hash.replace('#', '') : DEFAULT_SECTION
  }

  componentDidUpdate(prevProps) {
    if (this.props.articleUrl !== prevProps.articleUrl) {
      let articleUrl = this.props.articleUrl || null

      // Add protocol to URL if none specified
      if (articleUrl && !articleUrl.includes('//')) {
        articleUrl = 'https://'+articleUrl
      }

      this.setState({ url: articleUrl, currentSection: DEFAULT_SECTION }, () => {
        this.onSubmit()
      })
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
      // Reset section when querying a new URL
      const currentSection = (this.props.articleUrl == url) ? this.state.currentSection : DEFAULT_SECTION
      const href = `${window.location.pathname}?url=${this.state.url}#${currentSection}`
      const as = href
      Router.push(href, as)
      if (document.getElementById(currentSection)) {
        Array.prototype.slice.call(document.getElementsByTagName('section')).map(el => el.className = '')
        document.getElementById(currentSection).className = 'd-block'
      }
    }

    const articleMetadata = {}
    for (const prop in this.state.articleMetadata) {
      articleMetadata[prop] = null
    }

    // Reset state
    this.setState({
      url,
      articleMetadata,
      trustIndicators: {
        positive: [],
        negative: []
      },
      feedback: [],
      inProgress: (url) ? true : false
    })

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
          const trustIndicators = this.getTrustIndicators(articleMetadata)
          const feedback = this.getFeedback(articleMetadata)

          this.setState({
            articleMetadata,
            trustIndicators,
            feedback,
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
        const trustIndicators = this.getTrustIndicators(articleMetadata)
        const feedback = this.getFeedback(articleMetadata)

        this.setState({
          articleMetadata,
          trustIndicators,
          feedback,
          inProgress: false
        })
      }
    }
  }

  getTrustIndicators(articleMetadata) {
    const trustIndicators = { positive: [], negative: [] }
    for (let prop in articleMetadata) {
      if (articleMetadata[prop] !== null) {
        // Get positive and negative trust indicators in each section
        // (Looping over like this preserves the order of them)
        if (articleMetadata[prop].trustIndicators) {
          trustIndicators.positive = trustIndicators.positive.concat(articleMetadata[prop].trustIndicators.positive)
          trustIndicators.negative = trustIndicators.negative.concat(articleMetadata[prop].trustIndicators.negative)
        }
      }
    }
    return trustIndicators
  }

  getFeedback(articleMetadata) {
    const feedback = []
    for (let prop in articleMetadata) {
      if (articleMetadata[prop] !== null) {
        if (articleMetadata[prop].feedback) {
          feedback.concat(articleMetadata[prop].feedback)
        }
      }
    }
    return feedback 
  }

  toggleSection(e) {
    // Get section from target element of link (if no target element, then get it from current URL)
    // Note: getCurrentSectionFromLocation() returns the default section specified if none in URL
    if (e) e.preventDefault()
    const currentSection = e ? e.target.getAttribute('href').replace('#', '') : this.getCurrentSectionFromLocation()
    if (document.getElementById(currentSection)) {
      this.setState({currentSection})
      Array.prototype.slice.call(document.getElementsByTagName('section')).map(el => el.className = '')
      document.getElementById(currentSection).className = 'd-block'
    }
    const href = `${window.location.pathname}?url=${this.state.url}#${currentSection}`
    const as = href
    Router.push(href, as)
    window.scrollTo(0, 0) 
  }

  render() { 
    const { currentSection, url, articleMetadata, inProgress, trustIndicators, feedback } = this.state
    return (
      <Page inputUrl={url} onInputSubmit={this.onSubmit} onInputChange={this.onChange} disableInput={inProgress}>
        <main role="main">
          <div className="d-none d-md-block">{ inProgress && <div className="pt-5"><Loader/></div> }</div>
          <div className="container-fluid">
            <div className="row">
              <form className="d-md-none mb-3 pl-2 pr-2 w-100" onSubmit={this.onSubmit}>
                <div className="input-group">
                  <input id="inspect-url" className="form-control bg-light border-0" disabled={inProgress} placeholder="e.g. http://wwww.example.com/news/2019-01-01/article" name="url" type="text" value={url} onChange={this.onChange} />
                  <div className="input-group-append">
                    <button type="submit" className="btn btn-primary">Inspect</button>
                  </div>
                </div>
              </form>
              { url && !inProgress &&
                <div className="col-md-3 col-lg-2 d-none d-md-block sidebar bg-light">
                  <Sidebar currentSection={currentSection} onClickHandler={this.toggleSection} rootUrl={articleMetadata.links ? articleMetadata.links.domain : null}/>
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
                <section id="homepage">
                  { articleMetadata.homepage && <Homepage homepage={articleMetadata.homepage} /> }
                </section>
                <section id="article-trust">
                  { (trustIndicators.positive.length > 0 || trustIndicators.negative.length > 0) && <Trust trustIndicators={trustIndicators} /> }
                </section>
                <section id="article-sentiment">
                  { articleMetadata.text && <Sentiment sentiment={articleMetadata.text.sentiment} /> }
                </section>
                <section id="article-factcheck"> 
                  { articleMetadata.content && articleMetadata.factchecks && articleMetadata.text && <FactCheck factchecks={articleMetadata.factchecks} content={articleMetadata.content} textAnalysis={articleMetadata.text} /> }
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
                  { articleMetadata.content && articleMetadata.links && <Links links={articleMetadata.links} /> }
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