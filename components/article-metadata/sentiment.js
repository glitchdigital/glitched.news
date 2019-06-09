import React from "react"

export default class extends React.Component {
  render() {
    const { content } = this.props
    
    if (!content)
      return null
      
    return (
      <>
        <hr/>
        <h3>Sentiment analysis</h3>
        <p>
          Headlines and articles with extreme positive or negative scores may be designed to provoke rather than inform.
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
              <td className={(content.sentiment.headline.negative > 0) ? 'sentiment__negative--highlighted' : 'sentiment__negative' }>{content.sentiment.headline.negative}%</td>
              <td>{content.sentiment.headline.neutral}%</td>
              <td className={(content.sentiment.headline.positive > 0) ? 'sentiment__positive--highlighted' : 'sentiment__positive' }>{content.sentiment.headline.positive}%</td>
            </tr>
            <tr>
              <th style={{textAlign: "right", opacity: 0.5, border: 0}}>Body</th>
              <td className={(content.sentiment.body.negative > 0) ? 'sentiment__negative--highlighted' : 'sentiment__negative' }>{content.sentiment.body.negative}%</td>
              <td>{content.sentiment.body.neutral}%</td>
              <td className={(content.sentiment.body.positive > 0) ? 'sentiment__positive--highlighted' : 'sentiment__positive' }>{content.sentiment.body.positive}%</td>
            </tr>
            <tr>
              <th style={{textAlign: "right", opacity: 0.5, border: 0}}>Overall</th>
              <td className={(content.sentiment.overall.negative > 0) ? 'sentiment__negative--highlighted' : 'sentiment__negative' }>{content.sentiment.overall.negative}%</td>
              <td>{content.sentiment.overall.neutral}%</td>
              <td className={(content.sentiment.overall.positive > 0) ? 'sentiment__positive--highlighted' : 'sentiment__positive' }>{content.sentiment.overall.positive}%</td>
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