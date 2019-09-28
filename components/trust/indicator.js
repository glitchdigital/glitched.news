import ChartistGraph from 'react-chartist'

export default ({label, neg: negInput, pos: posInput}) => {
  const total = negInput + posInput
  const neg = Math.round((negInput * 100) / total)
  const pos = Math.round((posInput * 100) / total)

  const options = {
    donut: true,
    donutWidth: 50,
    donutSolid: true,  
    total: 100
  }

  const data = {
    labels: [ `${neg}%`, `${pos}%` ],
    series: [{
      value: neg,
      name: 'Neg',
      className: 'sentiment__piechart--negative'
    },
    {
      value: pos,
      name: 'Pos',
      className: 'sentiment__piechart--positive'
    }]
  }

  let needleRotate = '0deg'
  if (neg > pos) {
    needleRotate = `-${Math.round((neg * 100) / 115)}deg`
  } else {
    needleRotate = `${Math.round((pos * 100) / 115)}deg`
  }

  return (
    <div className='sentiment__chart'>
      <div className='sentiment__needle d-none' style={{transform: `rotate(${needleRotate})`}}/>
      <div className='sentiment__piechart' style={{height: '12em'}}>
        <ChartistGraph type={'Pie'} data={data} options={options} />
      </div>
      <h5 className='text-center text-uppercase'>{label}</h5>
      <p className='text-center text-muted mb-0'>
        <small>Negative / Positive</small>
      </p>
      <p className='text-center'>
        <span className='sentiment__negative--highlighted'>{neg}%</span>      
        <span className='text-muted ml-2 mr-2'>/</span>
        <span className='sentiment__positive--highlighted'>{pos}%</span>
      </p>
    </div>
  )
}