import React from "react"

export default class extends React.Component {
  render() {
    const { factchecks, content  } = this.props

    if (!factchecks || !content)
      return null

    return (
      <>
        <hr/>
        <h3>Quotes, facts and figures to check</h3>
        <p>
          Found <strong>{ content.quotes.length } quotes</strong> in the article, <strong>{ content.quotesWithNumbers.length } quotes</strong> and <strong>{ content.sentencesWithNumbers.length } sentences</strong> cite specific dates or numbers.
        </p>
        {content.quotes.length > 0 && <h4>Quotes</h4>}
        <ol>
        {content.quotes.map((quote, i) => (
          <li key={`${quote}-${i}`}><p><em>{quote}</em></p></li>
        ))}
        </ol>
        {factchecks['snopes'].length > 0 && (
          <>
            <h4>Snopes</h4>
            <p>
              Fact checks from <a target='_blank' href='https://www.snopes.com' rel='noreferrer'>Snopes</a> that might be related
            </p>
            {factchecks['snopes'].slice(0,5).map((link, i) => (
              <li key={`snopes-${link.url}`}>
                <a target='_blank' href={link.url} rel='noreferrer'>{link.title}</a>
              </li>
            ))}
            <br/>
          </>
        )}
        {factchecks['factcheck.org'].length > 0 && (
          <>
            <h4>FactCheck.org</h4>
            <p>
              Fact checks from <a target='_blank' href='https://www.factcheck.org' rel='noreferrer'>FactCheck.org</a> that might be related
            </p>
            {factchecks['factcheck.org'].slice(0,5).map((link, i) => (
              <li key={`factcheck.org-${link.url}`}>
                <a target='_blank' href={link.url} rel='noreferrer'>{link.title}</a>
              </li>
            ))}
            <br/>
          </>
        )}
      </>
    )
  }
}