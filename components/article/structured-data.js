import React from 'react'

import cloneObject from 'lib/clone-object'
import Indicator from 'components/indicator/gauge'

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

    if (!testResults)
     return null

    const pieChart = cloneObject(this.pieChartDefaults)

    const total = testResults.passed + testResults.warnings + testResults.failed
    pieChart.data.series[0].value = Math.round(testResults.failed / total * 100)
    pieChart.data.series[1].value = 100 - (Math.round(testResults.passed / total * 100) + Math.round(testResults.failed / total * 100))
    pieChart.data.series[2].value = Math.round(testResults.passed / total * 100)
    
    if (testResults.failed > 0) pieChart.data.labels[0] = testResults.failed
    if (testResults.warnings > 0) pieChart.data.labels[1] = testResults.warnings
    if (testResults.passed > 0) pieChart.data.labels[2] = testResults.passed    

    return (
      <>
        <hr/>
        <h3>Structured data</h3>
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
            <p>Pages with good structured data are more likely to be read.</p>
            <ul>
              <li><strong>{testResults.passed}</strong> tests passed</li>
              <li><strong>{testResults.failed}</strong> tests failed</li>
              <li><strong>{testResults.warnings}</strong> warnings</li>
            </ul>
          </div>
        </div>
        <hr/>
        <h4>Structured data summary</h4>
        <ul className='mt-4'>
          {Object.keys(testResults.groups).map(group => <li>
            <h5>
              {group}
              {testResults.groups[group].failed.length > 0 &&
                <small className='badge badge-danger ml-1'>
                  { testResults.groups[group].failed.length}
                  { testResults.groups[group].failed.length === 1 ? ' error' : ' errors'}
                </small>
              }
              {testResults.groups[group].warnings.length > 0 &&
                <small className='badge badge-warning ml-1'>
                  { testResults.groups[group].warnings.length}
                  { testResults.groups[group].warnings.length === 1 ? ' warning' : ' warnings'}
                </small>
              }
            </h5> 
          </li>)}
        </ul>
        <hr/>
        <table className='table w-100'>
          <tbody>
            {Object.keys(testResults.groups).map(group => {
              return (
                <>
                  <tr><td colSpan='3' className='font-weight-bold bg-light text-muted'>{group}</td></tr>
                  { testResults.groups[group].passed.map(test => <TestResult group={group} key={JSON.stringify(test)} {...test} />) }
                  { testResults.groups[group].info.map(test => <TestResult group={group} key={JSON.stringify(test)} {...test} />) }
                  { testResults.groups[group].warnings.map(test => <TestResult group={group} key={JSON.stringify(test)} {...test} />) }
                  { testResults.groups[group].failed.map(test => <TestResult group={group} key={JSON.stringify(test)} {...test} />) }
                </>
              )
            })}
          </tbody>
        </table>
      </>
    )
  }
}

class TestResult extends React.Component {
  render() {
    const { group, test, description, value, passed, warning, info } = this.props
    let icon = '✕'
    let className = 'structured-data__test--fail'
    if (passed) {
      if (info) {
        icon = 'ⓘ'
        className = 'structured-data__test--info'
      } else {
        icon = '✓'
        className = 'structured-data__test--pass'
      }
    } else if (warning) {
      icon = '⚠'
      className = 'structured-data__test--warn'
    }
    //structured-data__test-summary
    return(
      <tr className={className}>
        <td className='structured-data__test-icon font-weight-bold text-right'>{icon}</td>
        <td className='structured-data__test-description font-weight-bold'>{description || test}</td>
        <td className='structured-data__test-value text-muted'>
          {value && String(value) && String(value) !== '[object Object]' && String(value) }
        </td>
      </tr>
    )
  }
}