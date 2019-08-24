import React from "react"
import Link from 'next/link'
import { Trans } from "@lingui/macro"
export default class extends React.Component {
  render() {
    const { trending } = this.props
    return (
      <>
        <p>
          <em><Trans id="try_analyzing">Try analyzing recent news articles</Trans>…</em>
        </p>
        <div className="trending__news-articles">
          {trending.articles.map(article => (
            <p key={article.url}>
              <Link
                prefetch
                href={{
                  pathname: '/index',
                  query: { url: article.url }
                }}
                as={`/?url=${article.url}`}
              ><a rel='noreferrer'>{article.title}</a></Link>
              <small> – {article.domain}</small>
            </p>
          ))}
        </div>
      </>
    )
  }
}