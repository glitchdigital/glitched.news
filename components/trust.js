import React from "react"

export default class extends React.Component {
  render() {
    const { trustIndicators } = this.props
    return (
      <>
        <hr/>
        <h3>Trust indicators</h3>
        { trustIndicators.positive.length > 0 && (
          <>
            <h4>Positive</h4>
            <ul>
            { trustIndicators.positive.map((indicator, i) => (
              <li key={`positive-indicator-${indicator.text}-${i}`}>{indicator.text}</li>
            )) }
            </ul>
          </>
        )}
        { trustIndicators.negative.length > 0 && (
          <>
            <h4>Negative</h4>
            <ul>
            { trustIndicators.negative.map((indicator, i) => (
              <li key={`negative-indicator-${indicator.text}-${i}`}>{indicator.text}</li>
            )) }
            </ul>
          </>
          )}
      </>
    )
  }
}