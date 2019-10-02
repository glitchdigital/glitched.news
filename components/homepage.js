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
        <h2 className='text-primary text-truncate text-lowercase'>
          <i className='ion-md-paper mr-1'/> {homepage.domain}
        </h2>
        <p className='lead'>
          <span className='badge badge-pill badge-info'>{homepage.links.length || 0} links</span> on the homepage to <span className='badge badge-pill badge-info'>{Object.keys(linksByDomain).length} domains</span>
        </p>
        { homepage.links.length > 0 && 
          <>
            <h4>Links by domain</h4>
            <ul className='text-truncate'>
              {Object.keys(linksByDomain).map((domain, i) => (
                <li key={`homepage-link-domain-${i}-${domain}`}>
                  <strong>{domain}</strong> <span className='badge badge-pill badge-info'>{linksByDomain[domain].length}</span>
                </li>
              ))}
            </ul>
            <hr/>
            {Object.keys(linksByDomain).map(domain => (
              <>
                <h5>{domain} <span className='badge badge-pill badge-info'>{linksByDomain[domain].length}</span></h5>
                <ul className='text-truncate'>
                {linksByDomain[domain].map((link, i) => (
                  <li key={`homepage-link-url-${i}-${link.url}`}>
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
        }
      </>
    )
  }
}