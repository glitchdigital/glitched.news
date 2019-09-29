export default ({ group, test, description, value, passed, warning, info }) => {
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
    <tr className={className}>
      <td className='structured-data__test-icon font-weight-bold text-right'>{icon}</td>
      <td className='structured-data__test-description font-weight-bold'>{description || test}</td>
      <td className='structured-data__test-value text-muted text-break'>
        {value && String(value) && String(value) !== '[object Object]' && String(value) }
      </td>
    </tr>
  )
}