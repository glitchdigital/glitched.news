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
        <p className="lead">
          Found <strong>{related.domains.length}</strong> other sites with articles that might be related.
        </p>
        { related.articles.length > 0 && (
          <>
            <p>
            Found <strong>{related.articles.length}</strong> articles that might be related.
            </p>
            <ul>
            {related.articles.map(article => (
              <li key={article.url}>
                <Link
                  href={{
                    pathname: '/inspect',
                    query: { url: article.url }
                  }}
                  as={`/inspect?url=${article.url}`}
                ><a rel='noreferrer'>{article.title}</a></Link>
                <small className="text-muted"> – {article.domain}</small>
              </li>
            ))}
            </ul>
          </>
        )}
      </>
    )
  }
}