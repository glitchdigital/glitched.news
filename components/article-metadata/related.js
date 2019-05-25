import React from "react"
import Link from 'next/link'

export default class extends React.Component {
  render() {
    const { related } = this.props

    if (!related)
      return null

    return (
      <>
        <hr/>
        <h3>Related articles</h3>
        <p>
          Found <strong>{related.domains.length}</strong> other sites with articles that might be related.
        </p>
        { related.articles.length > 0 && (
          <>
            <p>
            Found <strong>{related.articles.length}</strong> articles that might be related.
            </p>
            {related.articles.map(article => (
              <li key={article.url}>
                <Link
                  prefetch
                  href={{
                    pathname: '/index',
                    query: { url: article.url }
                  }}
                  as={`/?url=${article.url}`}
                ><a>{article.title}</a></Link>
                <small> – {article.domain}</small>
              </li>
            ))}
          </>
        )}
      </>
    )
  }
}