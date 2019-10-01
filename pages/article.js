import React from 'react'
import Router from 'next/router'

import Page from 'components/page'
import Sidebar from 'components/sidebar'
import Loader from 'components/loader'
import Trust from 'components/trust'
import Homepage from 'components/homepage'
import Headline from 'components/article/headline'
import Content from 'components/article/content'
import Website from 'components/article/website'
import FactCheck from 'components/article/factcheck'
import Social from 'components/article/social'
import Sentiment from 'components/article/sentiment'
import Topics from 'components/article/topics'
import Related from 'components/article/related'
import Links from 'components/article/links'
import Blacklists from 'components/article/blacklists'
import StructuredData from 'components/article/structured-data'
import StructuredDataSummary from 'components/structured-data/summary'
import StructuredDataErrorsAndWarnings from 'components/structured-data/errors-and-warnings'
import TrustSummary from 'components/trust/summary'

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
      article: {
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

    const article = {}
    for (const prop in this.state.article) {
      article[prop] = null
    }

    // Reset state
    this.setState({
      url,
      article,
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
        this.eventSource = new EventSource(`${this.serverUrl}/api/article?url=${url}&stream=true`)
        this.eventSource.addEventListener('message', event => {
          // Update state with latest data
          const eventData = JSON.parse(event.data)
          let article = this.state.article
          article[eventData.endpoint] = eventData.data
          const trustIndicators = this.getTrustIndicators(article)
          const feedback = this.getFeedback(article)

          this.setState({
            article,
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
        const request = await fetch(`${this.serverUrl}/api/article?url=${url}`)
        const article = await request.json()
        const trustIndicators = this.getTrustIndicators(article)
        const feedback = this.getFeedback(article)

        this.setState({
          article,
          trustIndicators,
          feedback,
          inProgress: false
        })
      }
    }
  }

  getTrustIndicators(article) {
    const trustIndicators = { positive: [], negative: [] }
    for (let prop in article) {
      if (article[prop] !== null) {
        // Get positive and negative trust indicators in each section
        // (Looping over like this preserves the order of them)
        if (article[prop].trustIndicators) {
          trustIndicators.positive = trustIndicators.positive.concat(article[prop].trustIndicators.positive)
          trustIndicators.negative = trustIndicators.negative.concat(article[prop].trustIndicators.negative)
        }
      }
    }
    return trustIndicators
  }

  getFeedback(article) {
    const feedback = []
    for (let prop in article) {
      if (article[prop] !== null) {
        if (article[prop].feedback) {
          feedback.concat(article[prop].feedback)
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
    const { currentSection, url, article, inProgress, trustIndicators, feedback } = this.state
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
                    <button type="submit" disabled={inProgress} className="btn btn-primary">Inspect</button>
                  </div>
                </div>
              </form>
              { url && !inProgress &&
                <div className="col-md-3 col-lg-2 d-none d-md-block sidebar bg-light">
                  <Sidebar currentSection={currentSection} onClickHandler={this.toggleSection} rootUrl={article.links ? article.links.domain : null}/>
                </div>
              }
              <div className="col-md-9 col-lg-10 ml-sm-auto article">
                <div className="d-block d-md-none">{ inProgress && <Loader/> }</div>
                <div className="article__sections">
                  <section id="article-summary">
                    { article.content && <Headline content={article.content} /> }
                    { article.content && <Content content={article.content} /> } 
                    { article.blacklists && <Blacklists content={article.blacklists} /> }
                    { article.hosting && article.domain && <Website hosting={article.hosting} domain={article.domain} /> }
                    { (trustIndicators.positive.length > 0 || trustIndicators.negative.length > 0) && <TrustSummary trustIndicators={trustIndicators} /> }
                    { article['structured-data'] && article['structured-data'].testResults && <>
                      <hr/>
                      <StructuredDataSummary testResults={article['structured-data'].testResults}/>
                      <hr/>
                      <StructuredDataErrorsAndWarnings testResults={article['structured-data'].testResults}/>                      
                    </> }
                  </section>
                  <section id="article-trust">
                    { (trustIndicators.positive.length > 0 || trustIndicators.negative.length > 0) && <Trust trustIndicators={trustIndicators} /> }
                  </section>
                  <section id="article-sentiment">
                    { article.text && <Sentiment sentiment={article.text.sentiment} /> }
                  </section>
                  <section id="article-factcheck"> 
                    { article.content && article.factchecks && article.text && <FactCheck factchecks={article.factchecks} textAnalysis={article.text} /> }
                  </section>
                  <section id="article-topics">
                    { article.topics && <Topics topics={article.topics} /> }
                  </section>
                  <section id="article-social"> 
                    { article.social && article.social.facebook && <Social social={article.social} /> }
                  </section>
                  <section id="article-structured-data"> 
                    { article['structured-data'] && article['structured-data'].testResults && <StructuredData testResults={article['structured-data'].testResults} /> }
                  </section>
                  <section id="article-links"> 
                    { article.content && article.links && <Links links={article.links} /> }
                  </section>
                  <section id="article-related"> 
                    { article.related && <Related related={article.related} /> }
                  </section>
                  <section id="homepage">
                    { article.homepage && <Homepage homepage={article.homepage} /> }
                  </section>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Page>
    )
  }
}