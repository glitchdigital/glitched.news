export default ({ trustIndicators }) => (
  <>
  { trustIndicators.negative.length > 0 && trustIndicators.negative.map((indicator, i) => (
    <div
      key={`negative-indicator-${indicator.text}-${i}`}
      className='border rounded mt-2 mb-3 w-100'>
      <div className='bg-light border-bottom pt-3 pl-3 pr-3 pb-2'>
        <strong className='text-uppercase text-danger'>Negative</strong>
        <h5>{indicator.text}</h5>
      </div>
      <div className='pt-3 pl-3 pr-3'>
        { indicator.description && <span className='text-muted' dangerouslySetInnerHTML={{
          __html: `<p>${indicator.description.replace(/\n/g, '</p><p>')}</p>`
        }}></span> }
      </div>
    </div>
  )) }
  { trustIndicators.positive.length > 0 && trustIndicators.positive.map((indicator, i) => (
    <div
      key={`positive-indicator-${indicator.text}-${i}`}
      className='border rounded mt-2 mb-3 w-100'>
      <div className='bg-light border-bottom pt-3 pl-3 pr-3 pb-2'>
        <strong className='text-uppercase text-success'>Positive</strong>
        <h5>{indicator.text}</h5>
      </div>
      <div className='pt-3 pl-3 pr-3'>
        { indicator.description && <span className='text-muted' dangerouslySetInnerHTML={{
          __html: `<p>${indicator.description.replace(/\n/g, '</p><p>')}</p>`
        }}></span> }
      </div>
    </div>
  )) }
  </>
)
