import React from "react"
import TrustIndicator from 'components/indicator/pie'

export default class extends React.Component {
  render() {
    const { trustIndicators } = this.props
    return (
      <>
        <hr/>
        <h3>Trust indicators</h3>
        <div className='row'>
          <div className='col-md-4'>
            <TrustIndicator
              label='Trust indicators'
              pos={trustIndicators.positive.length}
              neg={trustIndicators.negative.length}
            />
          </div>
          <div className='col-md-8'>
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
          </div>
        </div>
      </>
    )
  }
}