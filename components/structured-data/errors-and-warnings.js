const TestResult = ({test, passed, warning, description}) => {
  let icon = <i className='ion-md-close'/>
  let className = 'badge badge-pill badge-danger'

  if (passed) {
    if (info) {
      icon = <i className='ion-md-information-circle'/>
      className = 'badge badge-pill badge-info'
    } else {
      icon = <i className='ion-md-checkmark'/>
      className = 'badge badge-pill badge-success'
    }
  } else if (warning) {
    icon = <i className='ion-md-warning'/>
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

export default ({testResults}) => {
  let hasErrorsOrWarnings = false

  Object.keys(testResults.groups).map(group => {
    if (testResults.groups[group].warnings.length === 0 &&
      testResults.groups[group].failed.length === 0)
    return

    hasErrorsOrWarnings = true
  })

  return (
  <div className='border rounded mb-3'>
    <div className='bg-light pl-3 pr-3 pt-3 border-bottom'>
      <h4>Errors and warnings</h4>
      <p className='text-muted'>
        Summary of errors and warnings for review.
      </p>
    </div>
    <div className='pl-3 pr-3 pt-3 pb-2'>
      { !hasErrorsOrWarnings && <p className='text-muted'>No errors or warnings.</p> }
      { hasErrorsOrWarnings && Object.keys(testResults.groups).map(group => {
        if (testResults.groups[group].warnings.length === 0 &&
            testResults.groups[group].failed.length === 0)
          return

        return (
          <>
            <h5 className=''>{group.replace(/^Google > /, '').replace(/ > (.*)$/, '')}</h5>
            <ul className='list-unstyled'>
              { testResults.groups[group].warnings.map(test => <TestResult group={group} key={JSON.stringify(test)} {...test} />) }
              { testResults.groups[group].failed.map(test => <TestResult group={group} key={JSON.stringify(test)} {...test} />) }
            </ul>
          </>
        )
      }) }
    </div> 
  </div>
  )
}