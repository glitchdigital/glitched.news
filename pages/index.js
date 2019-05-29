import React from "react"
import Router from 'next/router'
import { Trans } from "@lingui/macro"
import 'isomorphic-unfetch'

import { locales } from '../locales'

import Page from '../components/page'
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

async function api({ endpoint } = {}) {
  const server = `${window.location.protocol}//${window.location.host}`
  const request = await fetch(`${server}${endpoint}`)
  return await request.json()
}

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
      locale: null
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onSetLocale = this.onSetLocale.bind(this)
  }

  async componentDidMount() {
    this.setState({ locale: document.documentElement.lang })

    if (this.state.articleUrl) {
      this.onSubmit()
    } else {
      const trending = await api({ endpoint: `/api/trending` })
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

  async onSetLocale(e) {
    e.preventDefault()

    let { articleUrl } = this.props
    const locale = e.target.getAttribute('data-locale')

    // Set new locale at run time in the app
    const i18nCatalog = await api({ endpoint: `/api/locale?locale=${locale}` })
    eval(i18nCatalog.i18nCatalog)

    // Push route change with Router to update the app state
    Router.push({
      pathname: '/',
      asPath: `/?locale=${locale}&url=${articleUrl}`,
      query: { url: articleUrl, locale }
    })

    // Updates the HTML lang attribute on the DOM
    document.documentElement.lang = locale
    this.setState({ locale: document.documentElement.lang })
  }

  async onSubmit(e) {
    if (e) e.preventDefault()

    let articleUrl = null

    if (!document.getElementById('url') || !document.getElementById('url').value) {
      // Reset URL browser address bar
      Router.push('/', '/', {})
    } else {
      // Update URL browser address bar to reflect it has a URL
      articleUrl = document.getElementById('url').value

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
      }
    })

    // If we have a URL, get article metadata
    if (articleUrl) {
    for (let prop in this.state.articleMetadata) {
      api({ endpoint: `/api/article-metadata/${prop}?url=${articleUrl}` })
      .then(result => {
        this.setState(state => {
          let newState = state
          newState.articleMetadata[prop] = result
          return newState
        })
      })
      .catch(e => {
        // @TODO
      })
    } 
    }
  }

  render() {
    const { url } = this.props
    const { articleUrl, articleMetadata, trending, locale } = this.state
    const indicators = { positive: [], negative: [] }

    const total = Object.keys(articleMetadata).length
    let progress = 0
    for (let prop in articleMetadata) {
      if (articleMetadata[prop] !== null) {
        progress++

        // Get positive and negative indicators in each section
        // (Looping over like this preserves the order of them)
        if (articleMetadata[prop].indicators) {
          indicators.positive = indicators.positive.concat(articleMetadata[prop].indicators.positive)
          indicators.negative = indicators.negative.concat(articleMetadata[prop].indicators.negative)
        }
      }
    }

    return (
      <Page>
        <form onSubmit={this.onSubmit}>
          <div style={{background: '#eee', padding: '10px 20px', borderRadius: 10, marginTop: 20, marginBottom: 10}}>
            <div style={{display: 'inline-block', width: '100%', marginBottom: 10}}>
              <label style={{fontWeight: 600, textAlign: 'center', padding: '0 20'}} htmlFor="url">
                <Trans id="url_prompt">
                  Enter a news article URL to analyze
                </Trans>
              </label>
              <input placeholder="e.g. http://wwww.example.com/news/2019-01-01/article" style={{marginTop: 5, borderRadius: 50, fontSize: '.9em'}} id="url" name="url" type="text" defaultValue={articleUrl || ''} />
            </div>
            <p style={{marginBottom: 0}}>
              <small>
                <Trans id="about_prototype">
                  A prototype research tool to demonstrate how metadata and automated analysis can be combined.
                </Trans>
              </small>
            </p>
            { progress > 0 && progress < total && (
              <>
                { progress < total && (
                  <progress value={progress} max={total} style={{marginTop: 10}} />
                )}
              </>
            )}
          </div>
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
        <p style={{marginBottom: 5}}>
          <small>
            <span>&copy; GLITCH DIGITAL LIMITED, 2019. </span>
            <a target="_blank" href="https://github.com/glitchdigital/glitched.news">
              Published under the ISC License 
            </a>
          </small>
        </p>
        <p>
          <small>
            {Object.keys(locales).map(l => 
              <span key={`locale-${l}`}>
                <a href={`?locale=${l}`}
                   onClick={this.onSetLocale}
                   data-locale={l}
                   style={{fontWeight: (l === locale) ? 'bold' : 'normal'}}
                  >{l.toUpperCase()}</a>{' '}
              </span>
            )}
          </small>
        </p>
      </Page>
    )
  }
}