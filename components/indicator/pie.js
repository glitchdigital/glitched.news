import ChartistGraph from 'react-chartist'

export default ({label, neg: negInput, pos: posInput}) => {
  const total = negInput + posInput
  const neg = Math.round((negInput * 100) / total)
  const pos = Math.round((posInput * 100) / total)

  const options = {}

  const data = {
    labels: [ posInput, negInput ],
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
          <small>Positive / Negative</small>
        </p>
        <p className='text-center'>
          <span className='indicator__positive--highlighted'>{data.labels[0]}</span>
          <span className='text-muted ml-2 mr-2'>/</span>
          <span className='indicator__negative--highlighted'>{data.labels[1]}</span>
        </p>
      </div>
    </div>
  )
}