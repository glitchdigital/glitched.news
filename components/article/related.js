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
        <p className='lead'>
          Related articles on this site and from other sites
        </p>
        <p>
          Found <span className='badge badge-pill badge-info'>{related.domains.length} sites</span> with similar content.
        </p>
        { related.articles.length > 0 && (
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
        )}
      </>
    )
  }
}