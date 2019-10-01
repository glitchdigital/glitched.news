import React from 'react'

import TrustSummary from 'components/trust/summary'
import TrustIndicators from 'components/trust/indicators'

export default class extends React.Component {
  render() {
    const { trustIndicators } = this.props
    return (
      <>
        <hr/>
        <h2>Trust indicators</h2>
        <p className='lead mb-0'>Trust indicators based on article metadata.</p>        
        <TrustSummary trustIndicators={trustIndicators} />
        <hr className="mb-4"/>
        <TrustIndicators trustIndicators={trustIndicators} />
      </>
    )
  }
}