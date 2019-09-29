import React from 'react'

import StucturedDataSummary from 'components/structured-data/summary'

export default class extends React.Component {
  render() {
    const { testResults } = this.props

    if (!testResults)
     return null

    return (
      <>
        <hr/>
        <h3>Structured data</h3>
          <StucturedDataSummary testResults={testResults}/>
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