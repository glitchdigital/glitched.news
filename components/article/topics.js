import React from "react"

export default class extends React.Component {
  render() {
    const { topics } = this.props

    if (!topics)
      return null
      
    return (
      <>
        <hr/>
        <h3>Topics &amp; keywords</h3>
        <p className="lead">
          Found <strong>{topics.keywords.length} keywords</strong> and identified <strong>{topics.topics.length} topics</strong> that may be related to the article.
        </p>
        <h4>Keywords</h4>
        {(!topics.keywords || topics.keywords.length === 0) && <p className="text-muted">No keywords found.</p>}
        <ul className="list-unstyled">
        {topics.keywords.map((keyword, i) => (
          <li key={`keyword-${i}`}>
            <p>
              <span className="badge badge-pill badge-primary">{keyword.name}</span> <strong>{keyword.count || 1}</strong> mentions of this keyword
              {keyword.url && (
                <>
                  {' '}<br/><small><a target="_blank" href={keyword.url} rel='noreferrer'>{keyword.name} on Wikipedia</a></small>
                </>
              )}
            </p>
          </li>
        ))}
        </ul>
        <hr/>
        <h4>Topics</h4>
        {(!topics.keywords || topics.keywords.length === 0) && <p className="text-muted">No topics identified.</p>}
        <ul className="list-unstyled">
        {topics.topics.map((topic, i) => (
          <li key={`topic-${i}`}>
            <p>
              <span className="badge badge-pill badge-primary">{topic.name}</span> <strong>{topic.count || 1}</strong> possible references to this topic
              {topic.url && (
                <>
                  {' '}<br/><small><a target="_blank" href={topic.url} rel='noreferrer'>{topic.name} on Wikipedia</a></small>
                </>
              )}
            </p>
          </li>
        ))}
        </ul>
      </>
    )
  }
}