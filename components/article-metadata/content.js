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
        <h3>About article</h3>
        <ul>
        { content.publisher && (
          <li>
            Published by <strong>{truncate(content.publisher, 128)}</strong>
          </li>
        ) }
        { content.author && content.author != '' && content.author != 0 && (
          <li>
            Byline is credited to <strong>{content.author}</strong>
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
          <li>
          <strong>{content.wordCount}</strong> words ({content.characterCount} characters)
          </li>
        </ul>
      </>
    )
  }
}