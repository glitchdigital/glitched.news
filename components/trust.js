import React from 'react'

import TrustSummary from 'components/trust/summary'
import TrustIndicators from 'components/trust/indicators'

export default class extends React.Component {
  render() {
    const { trustIndicators } = this.props
    return (
      <>
        <hr/>
        <h2 className='text-primary'><i className='ion-md-checkmark-circle-outline'/> Trust indicators</h2>
        <p className='lead'>Trust indicators based on the contents of the article and on metadata</p>
        <TrustSummary trustIndicators={trustIndicators} />
        <TrustIndicators trustIndicators={trustIndicators} />
      </>
    )
  }
}