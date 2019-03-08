import React, { Fragment } from "react"

export default class extends React.Component {
  render() {
    const { links } = this.props
    return (
      <Fragment>
        <hr/>
        <h3>Links from this article</h3>
        <p>
          Found <strong>{links.length}</strong> links from this article.
        </p>
        {links.map((link, i) => (
          <li key={`${link.url}`}>
            <a href={`/?url=${link.url}`}>{link.title}</a>
            { link.domain && <small> – {' '}{link.domain}</small> }
          </li>
        ))}
      </Fragment>
    )
  }
}