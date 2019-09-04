export default class extends React.Component {
  render() {
    return(
      <div className="loader">
        <div class="spinner-border text-secondary" role="status">
            <span class="sr-only">Loading...</span>
        </div>
      </div>
    )
  }
}