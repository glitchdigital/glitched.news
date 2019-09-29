import TestResult from 'components/structured-data/test-result'

export default ({testResults}) => (
  <>
    <h4>Errors and warnings</h4>
    <p className='lead'>
      Summary of errors and warnings for review.
    </p>
    <table className='table table-sm w-100'>
      <tbody>
      {Object.keys(testResults.groups).map(group => {
          if (testResults.groups[group].warnings.length === 0 &&
              testResults.groups[group].failed.length === 0)
            return

          return (
            <>
              <tr><td colSpan='3' className='font-weight-bold bg-light text-muted'>{group}</td></tr>
              { testResults.groups[group].warnings.map(test => <TestResult group={group} key={JSON.stringify(test)} {...test} />) }
              { testResults.groups[group].failed.map(test => <TestResult group={group} key={JSON.stringify(test)} {...test} />) }
            </>
          )
        })}
      </tbody>
    </table>
  </>
)