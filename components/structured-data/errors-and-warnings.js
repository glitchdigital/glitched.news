const TestResult = ({test, passed, warning, description}) => {
  let icon = '✕'
  let className = 'badge badge-pill badge-danger'

  if (passed) {
    if (info) {
      icon = 'ⓘ'
      className = 'badge badge-pill badge-info'
    } else {
      icon = '✓'
      className = 'badge badge-pill badge-success'
    }
  } else if (warning) {
    icon = '⚠'
    className = ' badge badge-pill badge-warning'
  }

  return (
    <li className>
      <span className={className}>
        <span className='structured-data__test-icon font-weight-bold text-right'>{icon}</span>
      </span>
      <span className='ml-2 structured-data__test-description'>{description || test}</span>
    </li>
  )
}

export default ({testResults}) => (
  <>
    <h4>Errors and warnings</h4>
    <p className='lead'>
      Summary of errors and warnings for review.
    </p>
    {Object.keys(testResults.groups).map(group => {
      if (testResults.groups[group].warnings.length === 0 &&
          testResults.groups[group].failed.length === 0)
        return

      return (
        <>
          <h5 className=''>{group.replace(/^Google > /, '').replace(/ > (.*)$/, '')}</h5>
          <ul className='list-unstyled mb-3 pl-3'>
            { testResults.groups[group].warnings.map(test => <TestResult group={group} key={JSON.stringify(test)} {...test} />) }
            { testResults.groups[group].failed.map(test => <TestResult group={group} key={JSON.stringify(test)} {...test} />) }
          </ul>
        </>
      )
    })}    
  </>
)