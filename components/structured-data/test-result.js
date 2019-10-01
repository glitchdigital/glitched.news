export default ({ test, description, value, passed, warning, info }) => {
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

  return(
    <tr>
      <td className='structured-data__test-icon font-weight-bold text-right'>
        <span className={className}>
          <span className='structured-data__test-icon font-weight-bold text-right'>{icon}</span>
        </span>
      </td>
      <td className='structured-data__test-descriptio'>{description || test}</td>
      <td className='structured-data__test-value text-muted text-break '>
        {value && String(value) && String(value) !== '[object Object]' && String(value) }
      </td>
    </tr>
  )
}