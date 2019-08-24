import React from "react"

export default class extends React.Component {
  render() {
    const { content } = this.props

    if (!content)
      return null

    return (
      <div className="article__headline">
        <h6>HEADLINE</h6>
        { content.image && <a target="_blank" href={content.url} rel='noreferrer'><img alt="Main image from article" src={content.image}/></a> }
        <h1>
          <a target="_blank" href={content.url} rel='noreferrer'>{content.title}</a>
        </h1>
      </div>
    )
  }
}