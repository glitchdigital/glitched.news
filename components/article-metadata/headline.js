import React from "react"

export default class extends React.Component {
  render() {
    const { content } = this.props

    if (!content)
      return null

    return (
      <div className="article__headline">
        { content.image && <a target="_blank" href={content.url}><img src={content.image}/></a> }
        <h1>
          <a target="_blank" href={content.url}>{content.title}</a>
        </h1>
        <p>
          <a target="_blank" href={content.url}>{content.url}</a>
        </p>
      </div>
    )
  }
}