import React from 'react'

export default class extends React.Component {
  render() {
    const { topics } = this.props

    if (!topics)
      return null
      
    return (
      <>
        <hr/>
        <h2><i className='ion-md-pricetag mr-2'/> Topics &amp; keywords</h2>
        <p className='lead'>
          Found <span className='badge badge-pill badge-info'>{topics.keywords.length} keywords</span> and identified <span className='badge badge-pill badge-info'>{topics.topics.length} topics</span> that may be related to the article.
        </p>
        <div className='row'>
          <div className='col-md-6'>
            <h4>Keywords</h4>
            <hr/>
            {(!topics.keywords || topics.keywords.length === 0) && <p className='text-muted'>No keywords found.</p>}
            <ul className='list-unstyled'>
            {topics.keywords.map((keyword, i) => (
              <li key={`keyword-${i}`}>
                <p>
                  <span className='lead'><span className='badge badge-pill badge-primary mr-1'>{keyword.name}</span></span> <strong>{keyword.count || 1}</strong> mentions of this keyword
                  {keyword.url && (
                    <>
                      {' '}<br/><small><a target='_blank' href={keyword.url} rel='noreferrer'>{keyword.name} on Wikipedia</a></small>
                    </>
                  )}
                </p>
              </li>
            ))}
            </ul>
          </div>
          <div className='col-md-6'>
            <h4>Topics</h4>
            <hr/>
            {(!topics.topics || topics.topics.length === 0) && <p className='text-muted'>No topics identified.</p>}
            <ul className='list-unstyled'>
            {topics.topics.map((topic, i) => (
              <li key={`topic-${i}`}>
                <p>
                  <span className='lead'><span className='badge badge-pill badge-primary mr-1'>{topic.name}</span></span> <strong>{topic.count || 1}</strong> possible references to this topic
                  {topic.url && (
                    <>
                      {' '}<br/><small><a target='_blank' href={topic.url} rel='noreferrer'>{topic.name} on Wikipedia</a></small>
                    </>
                  )}
                </p>
              </li>
            ))}
            </ul>
          </div>
        </div>
      </>
    )
  }
}