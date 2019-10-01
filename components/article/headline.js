import React from 'react'

export default class extends React.Component {
  render() {
    const { content } = this.props

    if (!content)
      return null

    return (
      <div className='mb-2'>
        <strong className='text-muted'>HEADLINE</strong>
        { /* content.image && <a target='_blank' href={content.url} rel='noreferrer'><img alt='Main image from article' src={content.image}/></a> */ }
        <h4 className='mt-0 mb-2'>
          <a target='_blank' className='text-dark text-decoration-none' href={content.url} rel='noreferrer'>{content.title}</a>
        </h4>
      </div>
    )
  }
}