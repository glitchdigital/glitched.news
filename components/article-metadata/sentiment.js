import React from "react"

export default class extends React.Component {
  render() {
    const { content } = this.props
    
    if (!content) return null

    const SENTIMENT_HIGHLIGHT_THRESHOLD = 0
      
    return (
      <>
        <hr/>
        <h3>Sentiment analysis</h3>
        <p>
          Be wary of headlines or articles with extremely positive or negative scores.
        </p>
        <table className="sentiment">
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
              <td className={(content.sentiment.headline.negative > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__negative--highlighted' : 'sentiment__negative' }>{content.sentiment.headline.negative}%</td>
              <td className={(content.sentiment.headline.neutral > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__neutral--highlighted' : 'sentiment__neutral' }>{content.sentiment.headline.neutral}%</td>
              <td className={(content.sentiment.headline.positive > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__positive--highlighted' : 'sentiment__positive' }>{content.sentiment.headline.positive}%</td>
            </tr>
            <tr>
              <th>Body</th>
              <td className={(content.sentiment.body.negative > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__negative--highlighted' : 'sentiment__negative' }>{content.sentiment.body.negative}%</td>
              <td className={(content.sentiment.body.neutral > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__neutral--highlighted' : 'sentiment__neutral' }>{content.sentiment.body.neutral}%</td>
              <td className={(content.sentiment.body.positive > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__positive--highlighted' : 'sentiment__positive' }>{content.sentiment.body.positive}%</td>
            </tr>
            {/*
            <tr>
              <th>Overall</th>
              <td className={(content.sentiment.overall.negative > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__negative--highlighted' : 'sentiment__negative' }>{content.sentiment.overall.negative}%</td>
              <td className={(content.sentiment.overall.neutral > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__neutral--highlighted' : 'sentiment__neutral' }>{content.sentiment.overall.neutral}%</td>
              <td className={(content.sentiment.overall.positive > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__positive--highlighted' : 'sentiment__positive' }>{content.sentiment.overall.positive}%</td>
            </tr>
            */}
          </tbody>
        </table>
        <p>
          <small>
            Sentiment analysis powered by port of the VADER sentiment analysis tool
          </small>
        </p>
      </>
    )
  }
}