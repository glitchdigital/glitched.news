import React, { Fragment } from "react"

export default class extends React.Component {
  render() {
    const { content } = this.props
    return (
      <Fragment>
        <hr/>
        <h3>Sentiment analysis</h3>
        <p>
          Be wary of headlines and articles with extreme scores
        </p>
        <table style={{width: '100%', border: 0}}>
          <thead>
            <tr style={{opacity: 0.5}}>
              <th>&nbsp;</th>
              <th>Positive</th>
              <th>Neutral</th>
              <th>Negative</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Headline</th>
              <td style={{fontWeight: (content.sentiment.headline.positive >= 25) ? 'bold' : 'neutral' }}>{content.sentiment.headline.positive}%</td>
              <td style={{fontWeight: (content.sentiment.headline.neutral >= 25) ? 'bold' : 'neutral' }}>{content.sentiment.headline.neutral}%</td>
              <td style={{fontWeight: (content.sentiment.headline.negative >= 25) ? 'bold' : 'neutral' }}>{content.sentiment.headline.negative}%</td>
            </tr>
            <tr>
              <th>Body</th>
              <td style={{fontWeight: (content.sentiment.body.positive >= 25) ? 'bold' : 'neutral' }}>{content.sentiment.body.positive}%</td>
              <td style={{fontWeight: (content.sentiment.body.neutral >= 25) ? 'bold' : 'neutral' }}>{content.sentiment.body.neutral}%</td>
              <td style={{fontWeight: (content.sentiment.body.negative >= 25) ? 'bold' : 'neutral' }}>{content.sentiment.body.negative}%</td>
            </tr>
            <tr>
              <th>Overall</th>
              <td style={{fontWeight: (content.sentiment.overall.positive >= 25) ? 'bold' : 'neutral' }}>{content.sentiment.overall.positive}%</td>
              <td style={{fontWeight: (content.sentiment.overall.neutral >= 25) ? 'bold' : 'neutral' }}>{content.sentiment.overall.neutral}%</td>
              <td style={{fontWeight: (content.sentiment.overall.negative >= 25) ? 'bold' : 'neutral' }}>{content.sentiment.overall.negative}%</td>
            </tr>
          </tbody>
        </table>
        <p>
          <small>
            Sentiment analysis powered by port of the VADER sentiment analysis tool
          </small>
        </p>
      </Fragment>
    )
  }
}