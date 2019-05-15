import React from "react"

export default class extends React.Component {
  render() {
    const { trending } = this.props
    return (
      <>
        <h4>Example articles</h4>
        <p>Recent news articles from <strong>Google News</strong></p>
        {trending.articles.map(article => (
          <p key={article.url} style={{marginBottom: 0}}>
            <a href={`/?url=${article.url}`}>{article.title}</a> <small> – {article.domain}</small>
          </p>
        ))}
      </>
    )
  }
}