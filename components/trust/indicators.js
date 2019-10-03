export default ({ trustIndicators }) => (
  <>
  { trustIndicators.negative.length > 0 && trustIndicators.negative.map((indicator, i) => (
    <div
      key={`negative-indicator-${indicator.text}-${i}`}
      className='border rounded shadow-sm mt-2 mb-3 w-100 bg-light'>
      <div className='media'>
        <div className='pt-1 pl-4 pr-4'>
          <i style={{fontSize: '4em'}} className='text-danger ion-md-remove-circle'/>
        </div>
        <div className='media-body pt-4 pl-4 pr-4 pb-0 bg-white border-left'>
          <strong className='text-uppercase text-danger'>Negative</strong>
          <h5>{indicator.text}</h5>
          { indicator.description && <span className='text-muted' dangerouslySetInnerHTML={{
            __html: `<p>${indicator.description.replace(/\n/g, '</p><p>')}</p>`
          }}></span> }
        </div>
      </div>
    </div>
  )) }
  { trustIndicators.positive.length > 0 && trustIndicators.positive.map((indicator, i) => (
    <div
      key={`positive-indicator-${indicator.text}-${i}`}
      className='border rounded shadow-sm mt-2 mb-3 w-100 bg-light'>
      <div className='media'>
        <div className='pt-1 pl-4 pr-4'>
          <i style={{fontSize: '4em'}} className='text-success ion-md-add-circle'/>
        </div>
        <div className='media-body pt-4 pl-4 pr-4 pb-0 bg-white border-left'>
          <strong className='text-uppercase text-success'>Positive</strong>
          <h5>{indicator.text}</h5>
          { indicator.description && <span className='text-muted' dangerouslySetInnerHTML={{
            __html: `<p>${indicator.description.replace(/\n/g, '</p><p>')}</p>`
          }}></span> }
        </div>
      </div>
    </div>
  )) }
  </>
)
