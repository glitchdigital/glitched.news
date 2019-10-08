import React from 'react'

export default class extends React.Component {
  render() {
    const { factchecks, textAnalysis } = this.props

    if (!factchecks || !textAnalysis)
      return null

    return (
      <>
        <hr/>
        <h2 className='text-primary'><i className='ion-md-quote mr-2'/> Facts, figures, quotes &amp; citations</h2>
        <p className='lead'>
          Extracts verifiable information such as quotes, numbers and dates.
        </p>
        <p>
          Found <span className='badge badge-pill badge-info'>{ textAnalysis.quotes.length } quotes</span> in the article.
        </p>
        <p>
          Found <span className='badge badge-pill badge-info'>{ textAnalysis.quotesWithNumbers.length } quotes</span> and <span className='badge badge-pill badge-info'>{ textAnalysis.sentencesWithNumbers.length } sentences</span> which cite specific dates or numbers.
        </p>
        <p>
          This article has been given a citation score of <span className='badge badge-pill badge-info'>{textAnalysis.score}</span> points.*
        </p>
        <p className='text-muted font-italic'>
          <small>
            * This score is an experimental attempt at a metric to quantify the <strong>likely veracity and specific number of citations of facts in an article</strong>, based on the text of the article.
          </small>
        </p>
        {textAnalysis.quotes.length > 0 && <>
          <hr/>
          <h4>Quotes</h4> 
          <ol>
          {textAnalysis.quotes.map((quote, i) => (
            <li key={`${quote}-${i}`}><em>{quote}</em></li>
          ))}
          </ol>
        </>}
        {textAnalysis.sentencesWithNumbers.length > 0 && <>
          <hr/>
          <h4>Numbers and dates</h4>
          <ol>
          {textAnalysis.sentencesWithNumbers.map((citation, i) => (
            <li key={`${citation}-${i}`}><em>{citation}</em></li>
          ))}
          </ol>
        </>}
        {factchecks['snopes'].length > 0 && (
          <>
            <hr/>
            <h4>Snopes</h4>
            <p>
              Fact checks from <a target='_blank' href='https://www.snopes.com' rel='noreferrer'>Snopes</a> that might be related
            </p>
            <ol>
            {factchecks['snopes'].slice(0,5).map((link, i) => (
              <li key={`snopes-${link.url}`}>
                <a target='_blank' href={link.url} rel='noreferrer'>{link.title}</a>
              </li>
            ))}
            </ol>
            <br/>
          </>
        )}
        {factchecks['factcheck.org'].length > 0 && (
          <>
            <hr/>
            <h4>FactCheck.org</h4>
            <p>
              Fact checks from <a target='_blank' href='https://www.factcheck.org' rel='noreferrer'>FactCheck.org</a> that might be related
            </p>
            <ol>
            {factchecks['factcheck.org'].slice(0,5).map((link, i) => (
              <li key={`factcheck.org-${link.url}`}>
                <a target='_blank' href={link.url} rel='noreferrer'>{link.title}</a>
              </li>
            ))}
            </ol>
            <br/>
          </>
        )}
      </>
    )
  }
}