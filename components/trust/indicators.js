export default ({ trustIndicators }) => (
  <>
  { trustIndicators.negative.length > 0 && trustIndicators.negative.map((indicator, i) => (
    <div
      key={`negative-indicator-${indicator.text}-${i}`}
      className='border rounded shadow-sm p-4 mt-2 mb-2 w-100'>
      <strong className='text-uppercase text-danger'>Negative</strong>
      <h5>{indicator.text}</h5>
      { !indicator.description && <p className='text-muted'>{indicator.description}</p> }
    </div>
  )) }
  { trustIndicators.positive.length > 0 && trustIndicators.positive.map((indicator, i) => (
    <div
      key={`positive-indicator-${indicator.text}-${i}`}
      className='border rounded shadow-sm p-4 mt-2 mb-2 w-100'>
      <strong className='text-uppercase text-success'>Positive</strong>
      <h5>{indicator.text}</h5>
      { !indicator.description && <p className='text-muted'>{indicator.description}</p> }
    </div>
  )) }
  </>
)
