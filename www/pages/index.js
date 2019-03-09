import React, { Fragment } from "react"
import Router from 'next/router'
import 'isomorphic-unfetch'

import Page from '../components/page'
import Trending from '../components/trending'
import Trust from '../components/trust'
import Headline from '../components/inspect/headline'
import Content from '../components/inspect/content'
import Website from '../components/inspect/website'
import FactChecks from '../components/inspect/factchecks'
import Social from '../components/inspect/social'
import Topics from '../components/inspect/topics'
import Related from '../components/inspect/related'
import Links from '../components/inspect/links'
import Blacklists from '../components/inspect/blacklists'

async function api({ endpoint } = {}) {
  const server = (process.env.NODE_ENV === 'production') 
    ? `https://${window.location.host}`
    : 'http://localhost:3001'

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

    this.defaultState = {
      article: {
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
      articleUrl: null
    }

    this.state = this.defaultState
    this.state.articleUrl = props.articleUrl || null
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    if (this.state.articleUrl) {
      this.onSubmit()
    } else {
      api({ endpoint: `/api/trending` })
      .then(trending => {
        this.setState(state => {
          state.trending = trending
          return state
        })
      })
    }
  }

  async onSubmit(e) {
    if (e) e.preventDefault()

    if (!document.getElementById('url') || !document.getElementById('url').value)
      return

    let url = document.getElementById('url').value

    // Add protocol to URL if none specified
    if (!url.includes('//')) {
      url = 'https://'+url
      document.getElementById('url').value = url
    }

    const href = `/?url=${url}`
    const as = href
    Router.push(href, as, { shallow: true })

    let newState = this.defaultState
    newState.articleUrl = url
    this.setState(newState)

    api({ endpoint: `/api/inspect/content?url=${url}` })
    .then(content => {
      this.setState(state => {
        state.article.content = content
        return state
      })
    })

    api({ endpoint: `/api/inspect/social?url=${url}` })
    .then(social => {
      this.setState(state => {
        state.article.social = social
        return state
      })
    })

    api({ endpoint: `/api/inspect/topics?url=${url}` })
    .then(topics => {
      this.setState(state => {
        state.article.topics = topics
        return state
      })
    })

    api({ endpoint: `/api/inspect/related?url=${url}` })
    .then(related => {
      this.setState(state => {
        state.article.related = related
        return state
      })
    })

    api({ endpoint: `/api/inspect/hosting?url=${url}` })
    .then(hosting => {
      this.setState(state => {
        state.article.hosting = hosting
        return state
      })
    })

    api({ endpoint: `/api/inspect/domain?url=${url}` })
    .then(domain => {
      this.setState(state => {
        state.article.domain = domain
        return state
      })
    })

    api({ endpoint: `/api/inspect/factchecks?url=${url}` })
    .then(factchecks => {
      this.setState(state => {
        state.article.factchecks = factchecks
        return state
      })
    })

    api({ endpoint: `/api/inspect/blacklists?url=${url}` })
    .then(blacklists => {
      this.setState(state => {
        state.article.blacklists = blacklists
        return state
      })
    })
  }

  render() {
    const { articleUrl, article, trending } = this.state

    const indicators = { positive: [], negative:  [] }

    const total = Object.keys(this.defaultState.article).length
    let progress = 0
    for (let prop in article) {
      if (article[prop] !== null) {
        progress++

        // Get article positive and negative indicators in each section
        // (Looping over like this preserves the order of them)
        if (article[prop].indicators) {
          indicators.positive = indicators.positive.concat(article[prop].indicators.positive)
          indicators.negative = indicators.negative.concat(article[prop].indicators.negative)
        }
      }
    }

    return (
      <Page>
        <form onSubmit={this.onSubmit}>
          <div style={{background: '#eee', padding: '10px 20px', borderRadius: 10, marginTop: 20, marginBottom: 10}}>
            <div style={{display: 'inline-block', width: '100%', marginBottom: 10}}>
              <label style={{fontWeight: 600, textAlign: 'center', paddingLeft: 20}} htmlFor="url">Enter a news article URL to analyze</label>
              <input placeholder="e.g. http://wwww.example.com/news/2019-01-01/article" style={{marginTop: 5, borderRadius: 50}} id="url" name="url" type="text" defaultValue={articleUrl} />
            </div>
            <p style={{marginBottom: 0, paddingLeft: 20}}>
              <small>A prototype research tool to demonstrate how metadata and automated analysis can be combined.</small>
            </p>
            <p style={{paddingLeft: 20}}>
              <small>This example only targets English language articles for now.</small>
            </p>
          </div>
        </form>
        { !articleUrl && trending && <Trending trending={trending} /> }
        { progress > 0 && progress < total && (
          <Fragment>
            { progress < total && (
              <progress value={progress} max={total} style={{width: '100%'}} />
            )}
          </Fragment>
        )}
        { article.content && <Headline content={article.content} /> }
        { (indicators.positive.length > 0 || indicators.negative.length > 0) && <Trust indicators={indicators} /> }
        { article.blacklists && <Blacklists content={article.blacklists} /> }
        { article.content && <Content content={article.content} /> }
        { article.hosting && article.domain && <Website hosting={article.hosting} domain={article.domain} /> }
        { article.social && article.social.facebook && <Social social={article.social} /> }
        { article.content && article.factchecks && <FactChecks factchecks={article.factchecks} content={article.content} /> }
        { article.topics && article.topics && <Topics topics={article.topics} /> }
        { article.related && article.related && <Related related={article.related} /> }
        { article.content && article.content.links && <Links links={article.content.links} /> }
      </Page>
    )
  }
}