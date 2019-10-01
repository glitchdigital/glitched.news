import React from 'react'

export default class extends React.Component {
  render() {
    const { factchecks, textAnalysis } = this.props

    if (!factchecks || !textAnalysis)
      return null

    return (
      <>
        <hr/>
        <h2>Facts, figures &amp; quotes</h2>
        <p className='lead'>
          Found <span className='badge badge-pill badge-info'>{ textAnalysis.quotes.length } quotes</span> in the article.
        </p>
        <p className='lead'>
          <span className='badge badge-pill badge-info'>{ textAnalysis.quotesWithNumbers.length } quotes</span> and <span className='badge badge-pill badge-info'>{ textAnalysis.sentencesWithNumbers.length } sentences</span> cite specific dates or numbers.
        </p>
        <hr/>
        <p className='lead'>
          Citation score <span className='badge badge-pill badge-info'>{textAnalysis.score}</span>
        </p>
        <p className='text-muted font-italic'>
          Citation score is an experimental attempt at a metric to quantify the likely veracity of an article, based on the text of the article. Scores are always positive. Higher is better. There is no upper limit. Biased towards longer articles. The score for an article may vary over time as the mechanism is refined.
        </p>
        {textAnalysis.quotes.length > 0 && <>
          <hr/>
          <h4>Quotes</h4> 
          <ol className='ml-3'>
          {textAnalysis.quotes.map((quote, i) => (
            <li key={`${quote}-${i}`}><em>{quote}</em></li>
          ))}
          </ol>
        </>}
        {textAnalysis.sentencesWithNumbers.length > 0 && <>
          <hr/>
          <h4>Numbers and dates</h4>
          <p className='lead'>
            Numbers and dates should be attributable to a source and verifiable.
          </p>
          <ol className='ml-3'>
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
            <ol className='ml-3'>
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
            <ol className='ml-3'>
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