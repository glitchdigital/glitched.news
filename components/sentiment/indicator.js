import ChartistGraph from 'react-chartist'

export default ({label, data, options}) => {
  const neg = data.series[0].value
  const neu = data.series[1].value
  const pos = data.series[2].value

  let needleRotate = '0deg'
  const total = neg + pos + neu
  if (neg > pos) {
    needleRotate = `-${Math.round((neg * 100) / total)}deg`
  } else if (pos > neg) {
    needleRotate = `${Math.round((pos * 100) / total)}deg`
  }

  return (
    <div className='sentiment__chart'>
      <div className='sentiment__needle' style={{transform: `rotate(${needleRotate})`}}/>
      <div className='sentiment__piechart'>
        <ChartistGraph type={'Pie'} data={data} options={options} />
      </div>
      <div className='sentiment__barchart ml-auto mr-auto d-none'>
        {neg > 0 && <div className='d-inline-block sentiment__barchart--negative' style={{width: `${neg}%`}}/>}
        <div className='d-inline-block sentiment__barchart--neutral' style={{width: `${neu}%`}}/>
        {pos > 0 && <div className='d-inline-block sentiment__barchart--positive' style={{width: `${pos}%`}}/>}
      </div>
      <h5 className='text-center text-uppercase'>{label}</h5>
      <p className='text-center text-muted mb-0'>
        <small>Negative / Neutral / Positive</small>
      </p>
      <p className='text-center'>
        <span className='sentiment__negative--highlighted'>{neg}%</span>
        <span className='text-muted ml-2 mr-2'>/</span>
        <span className='sentiment__neutral--highlighted'>{neu}%</span>
        <span className='text-muted ml-2 mr-2'>/</span>
        <span className='sentiment__positive--highlighted'>{pos}%</span>
      </p>
    </div>
  )
}