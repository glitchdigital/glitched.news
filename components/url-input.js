import React from "react"
import { Trans } from "@lingui/macro"

export default class extends React.Component {
  render() {
    const { articleUrl, onSubmit, inProgress } = this.props
    return (
      <form id="url-form" onSubmit={onSubmit}>
        <label htmlFor="url">
          <Trans id="url_prompt">
            Enter a news article URL to analyze
          </Trans>
        </label>
        <div>
          <input className="form-control" disabled={inProgress} placeholder="e.g. http://wwww.example.com/news/2019-01-01/article" id="url" name="url" type="text" defaultValue={articleUrl || ''} />
        </div>
        <p>
          <small>
            <Trans id="about_prototype">
              A prototype research tool to demonstrate how metadata and automated analysis can be combined.
            </Trans>
          </small>
        </p>
      </form>
    )
  }
}