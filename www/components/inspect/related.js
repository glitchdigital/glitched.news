import React, { Fragment } from "react"

export default class extends React.Component {
  render() {
    const { related } = this.props

    return (
      <Fragment>
        <hr/>
        <h3>Related articles</h3>
        <p>
          Found <strong>{related.domains.length}</strong> other sites with articles that might be related.
        </p>
        { related.articles.length > 0 && (
          <Fragment>
            <p>
            Found <strong>{related.articles.length}</strong> articles that might be related.
            </p>
            {related.articles.map(article => (
              <li key={article.url}>
                <a href={`/?url=${article.url}`}>{article.title}</a> <small> – {article.domain}</small>
              </li>
            ))}
          </Fragment>
        )}
      </Fragment>
    )
  }
}