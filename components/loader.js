export default class extends React.Component {
  render() {
    return(
      <div className="loader">
        <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }
}