import React from "react"
import Link from 'next/link'

export default class extends React.Component {
  render() {
    const { trending } = this.props
    return (
      <>
        {trending.articles.map(article => (
          <p key={article.url} className="mb-0">
            <Link
              href={{
                pathname: '/inspect',
                query: { url: article.url }
              }}
              as={`/inspect?url=${article.url}`}
            ><a rel='noreferrer'>{article.title}</a></Link>
            <small> – {article.domain}</small>
          </p>
        ))}
      </>
    )
  }
}