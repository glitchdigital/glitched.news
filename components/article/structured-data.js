import React from 'react'

import StructuredDataSummary from 'components/structured-data/summary'
import StructuredDataErrorsAndWarnings from 'components/structured-data/errors-and-warnings'
import TestResult from 'components/structured-data/test-result'

export default class extends React.Component {
  render() {
    const { testResults } = this.props

    if (!testResults)
     return null

    return (
      <>
        <hr/>
        <h2 className='text-primary'><i className='ion-md-analytics mr-2'/> Structured data</h2>
        <StructuredDataSummary testResults={testResults}/>
        <hr/>
        <StructuredDataErrorsAndWarnings testResults={testResults}/>
        <hr/>
        <h4>Detailed information</h4>
        <p className='lead'>
          Detailed test results for review and debugging.
        </p>
        <table className='table table-sm w-100'>
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