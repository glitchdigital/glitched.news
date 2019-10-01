import React from "react"

export default class extends React.Component {
  render() {
    const { social } = this.props

    if (!social)
     return null

    return (
      <>
        <hr/>
        <h2>Social media</h2>
        <h4>Facebook</h4>
        <ul>
          { social.facebook.metadata && <li>Facebook metadata found on page.</li> }
          { !social.facebook.metadata && <li>No Facebook metadata found on page.</li> }
          <li>
            This link has been shared <strong>{social.facebook.share_count}</strong> times
          </li>
          <li>
            There are <strong>{social.facebook.comment_count} comments</strong> about this article
          </li>
        </ul>
        <h4>Twitter</h4>
        <ul>
          { social.twitter.metadata && <li>Twitter metadata found on page.</li> }
          { !social.twitter.metadata && <li>No Twitter metadata found on page.</li> }
        </ul>
      </>
    )
  }
}