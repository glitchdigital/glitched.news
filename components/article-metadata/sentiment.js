import React from "react"

export default class extends React.Component {
  render() {
    const { sentiment } = this.props
    
    if (!sentiment) return null

    const SENTIMENT_HIGHLIGHT_THRESHOLD = 0
      
    let positiveSentences = 0
    let negativeSentences = 0
    let neutralSentences = 0
    sentiment.sentences.map(sentence => {
      if (sentence.pos > SENTIMENT_HIGHLIGHT_THRESHOLD && sentence.pos > sentence.neg) {
        positiveSentences++
      } else if (sentence.neg > SENTIMENT_HIGHLIGHT_THRESHOLD && sentence.neg > sentence.pos) {
        negativeSentences++
      } else {
        neutralSentences++
      }
    })

    // @TODO Refactor into component
    let sentimentClassName = ''
    let sentimentText = 'The article contains mostly neutral sentences.'
    if (positiveSentences > neutralSentences && positiveSentences > negativeSentences) {
      sentimentClassName = 'sentiment__positive--highlighted'
      sentimentText = 'The article contains mostly positive sentences.'
    } else if (negativeSentences > neutralSentences && negativeSentences > positiveSentences) { 
      sentimentClassName = 'sentiment__negative--highlighted'
      sentimentText = 'The article contains mostly negative sentences.'
    }

    return (
      <>
        <hr/>
        <h3>Sentiment analysis</h3>

        <p className={sentimentClassName}>{sentimentText}</p>
        
        <ul>
          <li>{Math.round(negativeSentences / sentiment.sentences.length * 100)}% of sentences appear negative.</li>
          <li>{Math.round(neutralSentences / sentiment.sentences.length * 100)}% of sentences appear neutral.</li>
          <li>{Math.round(positiveSentences / sentiment.sentences.length * 100)}% of sentences appear positive.</li>
        </ul>
        
        <hr/>
      
        <table className="sentiment mb-4">
          <thead>
            <tr style={{opacity: 0.5}}>
              <th>&nbsp;</th>
              <th>Negative</th>
              <th>Neutral</th>
              <th>Positive</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Headline</th>
              <td className={(sentiment.headline.neg > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__negative--highlighted' : 'sentiment__negative' }>{Math.round(sentiment.headline.neg * 100)}%</td>
              <td className={(sentiment.headline.neu > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__neutral--highlighted' : 'sentiment__neutral' }>{Math.round(sentiment.headline.neu * 100)}%</td>
              <td className={(sentiment.headline.pos > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__positive--highlighted' : 'sentiment__positive' }>{Math.round(sentiment.headline.pos * 100)}%</td>
            </tr>
            <tr>
              <th>Body</th>
              <td className={(sentiment.text.neg > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__negative--highlighted' : 'sentiment__negative' }>{Math.round(sentiment.text.neg * 100)}%</td>
              <td className={(sentiment.text.neu > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__neutral--highlighted' : 'sentiment__neutral' }>{Math.round(sentiment.text.neu * 100)}%</td>
              <td className={(sentiment.text.pos > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__positive--highlighted' : 'sentiment__positive' }>{Math.round(sentiment.text.pos * 100)}%</td>
            </tr>
            <tr>
              <th>Overall</th>
              <td className={(sentiment.overall.neg > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__negative--highlighted' : 'sentiment__negative' }>{Math.round(sentiment.overall.neg * 100)}%</td>
              <td className={(sentiment.overall.neu > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__neutral--highlighted' : 'sentiment__neutral' }>{Math.round(sentiment.overall.neu * 100)}%</td>
              <td className={(sentiment.overall.pos > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__positive--highlighted' : 'sentiment__positive' }>{Math.round(sentiment.overall.pos * 100)}%</td>
            </tr>
          </tbody>
        </table>

        {/*sentiment.sentences.map((sentence, i) => {
          let className = ''
          
          if (sentence.pos > SENTIMENT_HIGHLIGHT_THRESHOLD && sentence.pos > sentence.neg) {
            className = 'sentiment__positive--highlighted'
          }

          if (sentence.neg > SENTIMENT_HIGHLIGHT_THRESHOLD && sentence.neg > sentence.pos) {
            className = 'sentiment__negative--highlighted'
          }

          return (
            <p className={`${className} pl-1 pr-1`}>
              {'X'.repeat(sentence.length)}
            </p>
          )
        })*/}

        <hr/>

        <p className="text-muted">
          Experimental sentiment analysis using VADER.
        </p>
      </>
    )
  }
}