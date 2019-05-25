import React from "react"
import Link from 'next/link'
import { Trans } from "@lingui/macro"
export default class extends React.Component {
  render() {
    const { trending } = this.props
    return (
      <>
        <p>
          <Trans id="try_inspecting">Try inspecting recent news articles from <strong>Google News</strong></Trans>
        </p>
        {trending.articles.map(article => (
          <p key={article.url} style={{marginBottom: 0}}>
            <Link
              prefetch
              href={{
                pathname: '/index',
                query: { url: article.url }
              }}
              as={`/?url=${article.url}`}
            ><a>{article.title}</a></Link>
            <small> – {article.domain}</small>
          </p>
        ))}
      </>
    )
  }
}