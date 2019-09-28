import React from "react"

export default class extends React.Component {
  render() {
    const { hosting, domain } = this.props

    if (!hosting || !domain)
      return null
      
    return (
      <>
        <hr/>
        <h3>About website</h3>
        <ul>
        { hosting.location && hosting.location.country && (
          <li>
            Website <strong>{hosting.hostname}</strong> is hosted in <strong>{hosting.location.country}</strong>
          </li>
        )}
        { domain.whois && domain.whois.creationDate && (
          <li>
            Domain <strong>{domain.domain}</strong> was registered on <strong>{domain.whois.creationDate}</strong>
          </li>
        )}
        { domain.whois && 
          domain.whois.registrantOrganization && (
          <li>
            Owned by <strong>{domain.whois.registrantOrganization}</strong>
          </li>
        )}
        { domain.whois && 
          domain.whois.registrantStreet &&
          domain.whois.registrantCity &&
          domain.whois.registrantCountry && (
          <li>
            Address listed as <strong>{domain.whois.registrantStreet}</strong>, <strong>{domain.whois.registrantCity}</strong> in <strong>{domain.whois.registrantCountry}</strong>
          </li>
        )}
        </ul>
        <p>
          <small>Some websites may have hosting in more than one location.</small>
        </p>
    </>
    )
  }
}