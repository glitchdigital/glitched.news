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

    return (
      <>
        <hr/>
        <h3>Sentiment analysis</h3>
        {negativeSentences > positiveSentences && <p className="sentiment__negative--highlighted">Overall, this article appears to have more negative sentences than positive sentences.</p>}
        {positiveSentences > negativeSentences && <p className="sentiment__positive--highlighted">Overall, this article appears to have more positive sentences than negative sentences.</p>}
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

        <hr/>

        <ul>
          <li>Negative sentences: {negativeSentences} ({Math.round(negativeSentences / sentiment.sentences.length * 100)}%)</li>
          <li>Neutral sentences: {neutralSentences} ({Math.round(neutralSentences / sentiment.sentences.length * 100)}%)</li>
          <li>Positive sentences: {positiveSentences} ({Math.round(positiveSentences / sentiment.sentences.length * 100)}%)</li>
        </ul>

        {sentiment.sentences.map((sentence, i) => {
          let className = ''
          
          if (sentence.pos > SENTIMENT_HIGHLIGHT_THRESHOLD && sentence.pos > sentence.neg) {
            className = 'sentiment__positive--highlighted'
          }

          if (sentence.neg > SENTIMENT_HIGHLIGHT_THRESHOLD && sentence.neg > sentence.pos) {
            className = 'sentiment__negative--highlighted'
          }

          return (
            <p className={`${className} pl-1 pr-1`}>
              {sentence.text}
            </p>
          )
        })}

        <hr/>

        <p className="text-muted">
          Sentiment analysis powered by port of the VADER sentiment analysis tool
        </p>
      </>
    )
  }
}