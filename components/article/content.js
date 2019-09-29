import React from "react"
import truncate from "lib/truncate"

export default class extends React.Component {
  render() {
    const { content } = this.props

    if (!content)
      return null

    return (
      <>
        <hr/>
        <ul>
        { content.publisher && (
          <li>
            Published by <strong>{truncate(content.publisher, 128)}</strong>
          </li>
        ) }
        { content.author && content.author != '' && content.author != 0 && (
          <li>
            Byline is credited to <strong>{truncate(content.author, 128)}</strong>
          </li>
        ) }
        { content.date && (
          <li>
            Published on <strong>{content.date}</strong>
          </li>
        ) }
        { content.copyright && (
          <li>
            Copyright <strong>{truncate(content.copyright, 128)}</strong>
          </li>
        ) }
        </ul>
      </>
    )
  }
}