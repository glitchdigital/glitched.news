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
    pieChart.data.series[0].value = Math.round(testResults.passed / total * 100)
    pieChart.data.series[1].value = 100 - (Math.round(testResults.passed / total * 100) + Math.round(testResults.failed / total * 100))
    pieChart.data.series[2].value = Math.round(testResults.failed / total * 100)
    pieChart.data.labels[0] = testResults.passed
    pieChart.data.labels[1] = testResults.warnings
    pieChart.data.labels[2] = testResults.failed

    return (
      <>
        <hr/>
        <h3>Structured data</h3>
        <div className='row'>
          <div className='col-sm-4'>
            <Indicator label='Structured data test' {...pieChart} />
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
              <li><strong>{testResults.warnings}</strong> warnings</li>
              <li><strong>{testResults.failed}</strong> tests failed</li>
            </ul>
          </div>
        </div>
        <hr/>
        <h4>Structured data test results</h4>
        <ul>
        {Object.keys(testResults.groups).map(group => {
          if (group === 'Metatags')
            return

          return (
            <li key={`test-group-${group}`} className='mt-3'>
              <h5>{group}</h5>
              <ul style={{listStyle: 'none'}}>
              { testResults.groups[group].passed.map(test => <TestResult key={JSON.stringify(test)} {...test} />) }
              { /* testResults.groups[group].info.map(test => <TestResult key={JSON.stringify(test)} {...test} />) */ }
              { testResults.groups[group].warnings.map(test => <TestResult key={JSON.stringify(test)} {...test} />) }
              { testResults.groups[group].failed.map(test => <TestResult key={JSON.stringify(test)} {...test} />) }
              </ul>
            </li>
          )
        })}
        </ul>
      </>
    )
  }
}

class TestResult extends React.Component {
  render() {
    const { test, description, value, passed, warning, info } = this.props
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
    return(
      <li className={className}>
        <span className='structured-data__test-summary'>
          <span className='structured-data__test-icon'>{icon} </span>
          <span className='structured-data__test-description'>{description || test}</span>
          <br/>
          {value && String(value) && String(value) !== '[object Object]' && <span className='text-muted structured-data__test-value'>
            <div className='row'>
              <div className='col-sm-1 d-none d-sm-block text-right border-right'>└</div>
              <div className='col-sm-11'><small>{String(value)}</small></div>
            </div>
          </span> }
        </span>
      </li>
    )
  }
}