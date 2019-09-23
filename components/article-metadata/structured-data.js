import React from "react"

export default class extends React.Component {
  render() {
    const { testResults } = this.props

    if (!testResults)
     return null

    return (
      <>
        <hr/>
        <h3>Structured data</h3>
        <h6>Structured data test summary</h6>
        <ol style={{listStyle: 'none'}}>
          <li>Okay: { testResults.passed }</li>
          <li>Errors: { testResults.failed }</li>
          <li>Warnings: { testResults.warnings }</li>
        </ol>
        {Object.keys(testResults.groups).map(group => {
          if (group === 'Metatags')
            return

          return (
            <div key={`group-${group}`}>
              <h6>{group}</h6>
              <ul style={{listStyle: 'none'}}>
              { testResults.groups[group].passed.map(test => <TestResult key={JSON.stringify(test)} {...test} />) }
              { /* testResults.groups[group].info.map(test => <TestResult key={JSON.stringify(test)} {...test} />) */ }
              { testResults.groups[group].warnings.map(test => <TestResult key={JSON.stringify(test)} {...test} />) }
              { testResults.groups[group].failed.map(test => <TestResult key={JSON.stringify(test)} {...test} />) }
              </ul>
            </div>
          )
        })}
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
          <span className='structured-data__test-description'>{description || test}</span><br/>
          {value && String(value) !== '[object Object]' && <span className='structured-data__test-value'>└─ {String(value)}</span> }
        </span>
      </li>
    )
  }
}