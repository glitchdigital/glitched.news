import React from "react"

export default class extends React.Component {
  render() {
    const { content } = this.props
    
    if (!content) return null

    const SENTIMENT_HIGHLIGHT_THRESHOLD = 10
      
    return (
      <>
        <hr/>
        <h3>Sentiment analysis</h3>
        <p>
          Be wary of headlines or articles with extremely positive or negative scores.
        </p>
        <table style={{width: '100%', border: 0}}>
          <thead>
            <tr style={{opacity: 0.5}}>
              <th style={{border: 0}}>&nbsp;</th>
              <th style={{textAlign: "center"}}>Negative</th>
              <th style={{textAlign: "center"}}>Neutral</th>
              <th style={{textAlign: "center"}}>Positive</th>
            </tr>
          </thead>
          <tbody style={{textAlign: "center"}}>
            <tr>
              <th style={{textAlign: "right", opacity: 0.5, border: 0}}>Headline</th>
              <td className={(content.sentiment.headline.negative > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__negative--highlighted' : 'sentiment__negative' }><span>{content.sentiment.headline.negative}%</span></td>
              <td>{content.sentiment.headline.neutral}%</td>
              <td className={(content.sentiment.headline.positive > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__positive--highlighted' : 'sentiment__positive' }><span>{content.sentiment.headline.positive}%</span></td>
            </tr>
            <tr>
              <th style={{textAlign: "right", opacity: 0.5, border: 0}}>Body</th>
              <td className={(content.sentiment.body.negative > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__negative--highlighted' : 'sentiment__negative' }><span>{content.sentiment.body.negative}%</span></td>
              <td>{content.sentiment.body.neutral}%</td>
              <td className={(content.sentiment.body.positive > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__positive--highlighted' : 'sentiment__positive' }><span>{content.sentiment.body.positive}%</span></td>
            </tr>
            <tr>
              <th style={{textAlign: "right", opacity: 0.5, border: 0}}>Overall</th>
              <td className={(content.sentiment.overall.negative > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__negative--highlighted' : 'sentiment__negative' }><span>{content.sentiment.overall.negative}%</span></td>
              <td>{content.sentiment.overall.neutral}%</td>
              <td className={(content.sentiment.overall.positive > SENTIMENT_HIGHLIGHT_THRESHOLD) ? 'sentiment__positive--highlighted' : 'sentiment__positive' }><span>{content.sentiment.overall.positive}%</span></td>
            </tr>
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