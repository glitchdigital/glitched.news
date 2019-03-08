import React, { Fragment } from "react"

export default class extends React.Component {
  render() {
    const { trending } = this.props
    return (
      <Fragment>
        <hr/>
        <h2>Example articles</h2>
        <p>Breaking news articles from <strong>Google News</strong></p>
        <ul>
        {trending.articles.map(article => (
          <li key={article.url}>
            <a href={`/?url=${article.url}`}>{article.title}</a> <small> – {article.domain}</small>
          </li>
        ))}
        </ul>
      </Fragment>
    )
  }
}