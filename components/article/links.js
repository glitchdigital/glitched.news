import React from "react"
import Link from 'next/link'

export default class extends React.Component {
  render() {
    const { links } = this.props

    if (!links)
      return null

    // @TODO Refactor out of render method
    let linksByDomain = {}
    links.links.map((link, i) => {
      if (!linksByDomain[link.domain])
        linksByDomain[link.domain] = []

      linksByDomain[link.domain].push(link)
    })
    
    return (
      <>
        <hr/>
        <h3>Links from this page</h3>
        <p className="lead">
          Found <strong>{links.links.length || 0}</strong> links on this page to <strong>{Object.keys(linksByDomain).length}</strong> domains.
        </p>
        <h4>Links by domain</h4>
        <ul>
          {Object.keys(linksByDomain).map((domain, i) => (
            <li key={`link-domain-${i}-${domain}`}>
              <strong>{domain}</strong> ({linksByDomain[domain].length})
            </li>
          ))}
        </ul>
        <hr/>
        {Object.keys(linksByDomain).map(domain => (
          <>
            <h5>{domain}</h5>
            <ul>
            {linksByDomain[domain].map((link, i) => (
              <li key={`link-url-${i}-${link.url}`}>
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