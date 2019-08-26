import React from "react"

export default class extends React.Component {
  render() {
    const { topics } = this.props

    if (!topics)
      return null
      
    return (
      <>
        <hr/>
        <h3>Topics and keywords</h3>
        <p>
          Identified <strong>{topics.topics.length} topics</strong> and <strong>{topics.keywords.length} keywords</strong> that may be referenced in this article.
        </p>
        <ul>
        {topics.topics.map((topic, i) => (
          <li key={`topic-${i}`}>
            <p>
              <strong>{topic.name}</strong> – <strong>{topic.count || 1}</strong> possible references to this topic
              {topic.url && (
                <>
                  {' '}<br/><small><a target="_blank" href={topic.url} rel='noreferrer'>{topic.name} on Wikipedia</a></small>
                </>
              )}
            </p>
          </li>
        ))}
        </ul>
        <ul>
        {topics.keywords.map((keyword, i) => (
          <li key={`keyword-${i}`}>
            <p>
              <strong>{keyword.name}</strong> – <strong>{keyword.count || 1}</strong> mentions of this keyword
              {keyword.url && (
                <>
                  {' '}<br/><small><a target="_blank" href={keyword.url} rel='noreferrer'>{keyword.name} on Wikipedia</a></small>
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