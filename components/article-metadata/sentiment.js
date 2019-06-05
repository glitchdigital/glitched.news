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
          Headlines and articles with extreme scores may designed to provoke rather than inform.
        </p>
        <table style={{width: '100%', border: 0}}>
          <thead>
            <tr style={{opacity: 0.5}}>
              <th style={{border: 0}}>&nbsp;</th>
              <th style={{textAlign: "center"}}>Positive</th>
              <th style={{textAlign: "center"}}>Neutral</th>
              <th style={{textAlign: "center"}}>Negative</th>
            </tr>
          </thead>
          <tbody style={{textAlign: "center"}}>
            <tr>
              <th style={{textAlign: "right", opacity: 0.5, border: 0}}>Headline</th>
              <td style={{fontWeight: (content.sentiment.headline.positive >= 20) ? 'bold' : 'neutral' }}>{content.sentiment.headline.positive}%</td>
              <td style={{fontWeight: (content.sentiment.headline.neutral >= 20) ? 'bold' : 'neutral' }}>{content.sentiment.headline.neutral}%</td>
              <td style={{fontWeight: (content.sentiment.headline.negative >= 20) ? 'bold' : 'neutral' }}>{content.sentiment.headline.negative}%</td>
            </tr>
            <tr>
              <th style={{textAlign: "right", opacity: 0.5, border: 0}}>Body</th>
              <td style={{fontWeight: (content.sentiment.body.positive >= 20) ? 'bold' : 'neutral' }}>{content.sentiment.body.positive}%</td>
              <td style={{fontWeight: (content.sentiment.body.neutral >= 20) ? 'bold' : 'neutral' }}>{content.sentiment.body.neutral}%</td>
              <td style={{fontWeight: (content.sentiment.body.negative >= 20) ? 'bold' : 'neutral' }}>{content.sentiment.body.negative}%</td>
            </tr>
            <tr>
              <th style={{textAlign: "right", opacity: 0.5, border: 0}}>Overall</th>
              <td style={{fontWeight: (content.sentiment.overall.positive >= 20) ? 'bold' : 'neutral' }}>{content.sentiment.overall.positive}%</td>
              <td style={{fontWeight: (content.sentiment.overall.neutral >= 20) ? 'bold' : 'neutral' }}>{content.sentiment.overall.neutral}%</td>
              <td style={{fontWeight: (content.sentiment.overall.negative >= 20) ? 'bold' : 'neutral' }}>{content.sentiment.overall.negative}%</td>
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