export default ({ trustIndicators }) => (
  <div className='row row-eq-height'>
    <div className='col-md-6 p-3'>
      <div className='h-100 border rounded shadow-sm p-4'>
        <strong className='d-inline-block mb-2 text-uppercase text-muted'>
          Trust indicators
        </strong>
        <h4 className='mb-3 text-danger'>
          Negative
        </h4>
        { trustIndicators.negative.length > 0 && (
          <ul className='pl-4 mb-0'>
            { trustIndicators.negative.map((indicator, i) => (
              <li key={`negative-indicator-${indicator.text}-${i}`}>{indicator.text}</li>
            )) }
          </ul>
        )}
      </div>
    </div>
    <div className='col-md-6 p-3'>
      <div className='h-100 border rounded shadow-sm p-4'>
        <strong className='d-inline-block mb-2 text-uppercase text-muted'>
          Trust indicators
        </strong>
        <h4 className='mb-3 text-success'>
          Positive
        </h4>
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
)
