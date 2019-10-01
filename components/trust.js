import React from 'react'

import TrustSummary from 'components/trust/summary'
import TrustIndicators from 'components/trust/indicators'

export default class extends React.Component {
  render() {
    const { trustIndicators } = this.props
    return (
      <>
        <hr/>
        <h2><i className='ion-md-checkmark-circle-outline mr-2'/> Trust indicators</h2>
        <p className='lead mb-0'>Trust indicators based on article metadata.</p>        
        <TrustSummary trustIndicators={trustIndicators} />
        <TrustIndicators trustIndicators={trustIndicators} />
      </>
    )
  }
}