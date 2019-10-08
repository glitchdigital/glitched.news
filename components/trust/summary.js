export default ({ trustIndicators }) => (
  <div className='row row-eq-height'>
    <div className='col-md-6 mb-2 mt-2'>
      <div className='h-100 border rounded'>
        <div className='bg-light border-bottom pt-2 pb-2 pr-3 pl-3'>
          <strong className='d-inline-block mb-2 text-uppercase text-muted'>
            Trust indicators
          </strong>
          <h4 className='text-danger'><i class='ion-md-remove-circle mr-1'/> Negative indicators</h4>
        </div>
        <div className='p-3'>
          { trustIndicators.negative.length === 0 && <p className='text-muted'>No negative indicators found.</p> }
          { trustIndicators.negative.length > 0 && (
            <ul className='pl-4 mb-0'>
              { trustIndicators.negative.map((indicator, i) => (
                <li key={`negative-indicator-${indicator.text}-${i}`}>{indicator.text}</li>
              )) }
            </ul>
          )}
        </div>
      </div>
    </div>
    <div className='col-md-6 mb-2 mt-2'>
      <div className='h-100 border rounded'>
        <div className='bg-light border-bottom pt-2 pb-2 pr-3 pl-3'>
          <strong className='d-inline-block mb-2 text-uppercase text-muted'>
            Trust indicators
          </strong>
          <h4 className='text-success'><i class='ion-md-add-circle mr-1'/> Positive indicators</h4>
        </div>
        <div className='p-3'>
          { trustIndicators.positive.length === 0 && <p className='text-muted'>No positive indicators found.</p> }
          { trustIndicators.positive.length > 0 && (
            <ul className='pl-4 mb-0'>
              { trustIndicators.positive.map((indicator, i) => (
                <li key={`positive-indicator-${indicator.text}-${i}`}>{indicator.text}</li>
              )) }
            </ul>
          )}
        </div>
      </div>
    </div>
  </div>
)
