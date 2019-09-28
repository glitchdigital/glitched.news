import React from 'react'
import Link from 'next/link'

export default class extends React.Component {
  render() {
    const { homepage } = this.props

    // @TODO Refactor out of render method
    let linksByDomain = {}
    homepage.links.map((link, i) => {
      if (!linksByDomain[link.domain])
        linksByDomain[link.domain] = []

      linksByDomain[link.domain].push(link)
    })

    return (
      <>
        <hr/>
        <h3>Homepage</h3>
        <p>
          Found <strong>{homepage.links.length || 0}</strong> links on the homepage to <strong>{Object.keys(linksByDomain).length}</strong> domains.
        </p>
        {Object.keys(linksByDomain).map(domain => (
          <>
            <h5>{domain}</h5>
            <ul>
            {linksByDomain[domain].map((link, i) => (
              <li key={`${link.url}`}>
                <Link
                  href={{
                    pathname: '/article',
                    query: { url: link.url }
                  }}
                  as={`/article?url=${link.url}`}
                ><a rel='noreferrer'>{link.title || link.url}</a></Link>
              </li>
            ))}
            </ul>
          </>
        ))}
      </>
    )
  }
}