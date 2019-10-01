import Indicator from 'components/indicator/gauge'
import cloneObject from 'lib/clone-object'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.pieChartDefaults = {
      options: {
        donut: true,
        donutWidth: 50,
        donutSolid: true,
        startAngle: 270,
        total: 200
      },
      data: {
        labels: [ ' ', ' ', ' ' ],
        series: [{
          value: 0,
          name: 'Neg',
          className: 'indicator__piechart--negative'
        },
        {
          value: 0,
          name: 'Neu',
          className: 'indicator__piechart--warning'
        },
        {
          value: 0,
          name: 'Pos',
          className: 'indicator__piechart--positive'
        }]
      }
    }
  }

  render() {
    const { testResults } = this.props

    const pieChart = cloneObject(this.pieChartDefaults)

    const total = testResults.passed + testResults.warnings + testResults.failed
    pieChart.data.series[0].value = Math.round(testResults.failed / total * 100)
    pieChart.data.series[1].value = 100 - (Math.round(testResults.passed / total * 100) + Math.round(testResults.failed / total * 100))
    pieChart.data.series[2].value = Math.round(testResults.passed / total * 100)
    
    pieChart.data.labels = [
      `${pieChart.data.series[0].value}`,
      `${pieChart.data.series[1].value}`,
      `${pieChart.data.series[2].value}`
    ]

    return (
      <div className='row'>
        <div className='col-sm-4'>
          <Indicator label='Structured data test' {...pieChart} description='Failed / Warnings / Passed'/>
        </div>
        <div className='col-sm-8'>
          <p className='lead'>Structured data refers to metadata found on web pages. </p>
          <p>
            Structured data is used by search engines and social media sites to help machines 'read' articles,
            which allows people to more easily discover and share them.
          </p>
          <p>Pages with good structured data are more likely to be read by more people.</p>
        </div>
      </div>
    )
  }
};