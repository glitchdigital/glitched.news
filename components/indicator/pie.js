import ChartistGraph from 'react-chartist'

export default ({label, neg: negInput, pos: posInput}) => {
  const total = negInput + posInput
  const neg = Math.round((negInput * 100) / total)
  const pos = Math.round((posInput * 100) / total)

  const options = {
    donut: true,
    donutWidth: 60,
    donutSolid: true,  
    total: 100
  }

  const data = {
    labels: [ `${pos}%`, `${neg}%`],
    series: [{
        value: pos,
        name: 'Pos',
        className: 'indicator__piechart--positive'
      },
      {
        value: neg,
        name: 'Neg',
        className: 'indicator__piechart--negative'
    }]
  }

  return (
    <div className='indicator'>
      <div className='indicator__chart'>
        <div className='indicator__piechart'>
          <ChartistGraph type={'Pie'} data={data} options={options} />
        </div>
        <h5 className='text-center text-uppercase'>{label}</h5>
        <p className='text-center text-muted mb-0'>
          <small>Negative / Positive</small>
        </p>
        <p className='text-center'>
          <span className='indicator__negative--highlighted'>{neg}%</span>
          <span className='text-muted ml-2 mr-2'>/</span>
          <span className='indicator__positive--highlighted'>{pos}%</span>
        </p>
      </div>
    </div>
  )
}