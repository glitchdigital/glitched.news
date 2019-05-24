import React from "react"
import Link from 'next/link'
export default class extends React.Component {
  render() {
    const { trending } = this.props
    return (
      <>
        <h4>Example articles</h4>
        <p>Recent news articles from <strong>Google News</strong></p>
        {trending.articles.map(article => (
          <p key={article.url} style={{marginBottom: 0}}>
            {/*
            <Link
              prefetch
              href={{
                pathname: '/index',
                query: { url: article.url }
              }}
              as={`/?url=${article.url}`}
            ><a>{article.title}</a></Link>
            */}
            <a href={`/?url=${article.url}`}>{article.title}</a>
            <small> – {article.domain}</small>
          </p>
        ))}
      </>
    )
  }
}