import ChartistGraph from 'react-chartist'

export default ({label, data, options}) => {
  const neg = data.series[0].value
  const neu = data.series[1].value
  const pos = data.series[2].value

  // @TODO Refactor to take neg/neu/pos as values isntead of data and options
  /*
  const options = {
    donut: true,
    donutWidth: 50,
    donutSolid: true,
    startAngle: 270,
    total: 200
  }

  const data = {
    labels: [ ' ', ' ', ' ' ],
    series: [{
        value: neg,
        name: 'Neg',
        className: 'indicator__piechart--negative'
      },
      {
        value: neu,
        name: 'Neu',
        className: 'indicator__piechart--neutral'
      },
      {
        value: pos,
        name: 'Pos',
        className: 'indicator__piechart--positive'
      }]
  }
  */

  let needleRotate = '0deg'
  if (neg > pos) {
    needleRotate = `-${Math.round((neg * 100) / 115)}deg`
  } else if (pos > neg) {
    needleRotate = `${Math.round((pos * 100) / 115)}deg`
  }

  return (
    <div className='indicator'>
      <div className='indicator__chart'>
        <div className='indicator__needle' style={{transform: `rotate(${needleRotate})`}}/>
        <div className='indicator__piechart indicator__piechart--gauge'>
          <ChartistGraph type={'Pie'} data={data} options={options} />
        </div>
        <div className='indicator__barchart ml-auto mr-auto d-none'>
          {neg > 0 && <div className='d-inline-block indicator__barchart--negative' style={{width: `${neg}%`}}/>}
          <div className='d-inline-block indicator__barchart--neutral' style={{width: `${neu}%`}}/>
          {pos > 0 && <div className='d-inline-block indicator__barchart--positive' style={{width: `${pos}%`}}/>}
        </div>
        <h5 className='text-center text-uppercase'>{label}</h5>
        <p className='text-center text-muted mb-0'>
          <small>Negative / Neutral / Positive</small>
        </p>
        <p className='text-center'>
          <span className='indicator__negative--highlighted'>{neg}%</span>
          <span className='text-muted ml-2 mr-2'>/</span>
          <span className='indicator__neutral--highlighted'>{neu}%</span>
          <span className='text-muted ml-2 mr-2'>/</span>
          <span className='indicator__positive--highlighted'>{pos}%</span>
        </p>
      </div>
    </div>
  )
}