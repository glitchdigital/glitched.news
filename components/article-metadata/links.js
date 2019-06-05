import React from "react"
import Link from 'next/link'

export default class extends React.Component {
  render() {
    const { links } = this.props

    if (!links)
      return null

    return (
      <>
        <hr/>
        <h3>Links from this article</h3>
        <p>
          Found <strong>{links.length}</strong> links from this article.
        </p>
        <ul>
        {links.map((link, i) => (
          <li key={`${link.url}`}>
            <Link
              prefetch
              href={{
                pathname: '/index',
                query: { url: link.url }
              }}
              as={`/?url=${link.url}`}
            ><a>{link.title}</a></Link>
            { link.domain && <small> – {' '}{link.domain}</small> }
          </li>
        ))}
        </ul>
      </>
    )
  }
}