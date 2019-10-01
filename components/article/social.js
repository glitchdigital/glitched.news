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
        <ul>
          { social.facebook.metadata && <li><strong>Facebook</strong> metadata found on page.</li> }
          { !social.facebook.metadata && <li>No Facebook metadata found on page.</li> }
          { social.facebook.comment_count &&
          <>
            <li>
              This link has been shared <strong>{social.facebook.share_count}</strong> times
            </li>
            <li>
              There are <strong>{social.facebook.comment_count} comments</strong> about this article
            </li>
          </>
          }
          { social.twitter.metadata && <li><strong>Twitter</strong> metadata found on page.</li> }
          { !social.twitter.metadata && <li>No Twitter metadata found on page.</li> }
        </ul>
      </>
    )
  }
}