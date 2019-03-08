import React, { Fragment } from "react"

export default class extends React.Component {
  render() {
    const { topics } = this.props
    return (
      <Fragment>
        <hr/>
        <h3>Topics</h3>
        <p>
          Identified <strong>{topics.topics.length} topics</strong> and <strong>{topics.keywords.length} keywords</strong> that may be referenced in this article.
        </p>
        <ul>
        {topics.topics.map(topic => (
          <Fragment>
            <li>
              <p>
                <strong>{topic.name}</strong> {topic.count && (<Fragment> – <strong>{topic.count}</strong> possible references</Fragment>)}
              {topic.url && (
                <Fragment>
                  {' '}<br/><a target="_blank" href={topic.url}>⧉ Read about {topic.name} on Wikipedia</a>
                </Fragment>
              )}
              </p>
              {/*
              {topic.description && (
                <p>
                  <small>
                    {topic.description}
                    {topic.url && (
                      <Fragment>
                        {' '} <a target="_blank" href={topic.url}>⧉ More…</a>
                      </Fragment>
                    )}
                  </small>
                </p>
              )}
              */}
            </li>
          </Fragment>
        ))}
        </ul>
        <ul>
        {topics.keywords.map(keyword => (
          <Fragment>
            <li><strong>{keyword.name}</strong> {keyword.count && (<Fragment>mentioned <strong>{keyword.count}</strong> times</Fragment>)}</li>
          </Fragment>
        ))}
        </ul>
      </Fragment>
    )
  }
}