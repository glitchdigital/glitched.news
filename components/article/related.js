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
        <h2 className='text-primary'><i className='ion-md-albums mr-2'/> Related articles</h2>
        <p className="lead">
          <span className='badge badge-pill badge-info'>{related.domains.length} sites</span> are reporting similar news.
        </p>
        { related.articles.length > 0 && (
          <>
            <p className="lead">
              <span className='badge badge-pill badge-info'>{related.articles.length} articles</span> might be related.
            </p>
            <ul className='text-truncate'>
            {related.articles.map(article => (
              <li key={article.url}>
                <Link
                  href={{
                    pathname: '/article',
                    query: { url: article.url }
                  }}
                  as={`/article?url=${article.url}`}
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