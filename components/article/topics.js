import React from 'react'
import ChartistGraph from 'react-chartist'

export default class extends React.Component {
  render() {
    const { topics } = this.props

    if (!topics)
      return null

    const options = {
      reverseData: true,
      horizontalBars: true,
      axisX: {
        onlyInteger: true,
        showGrid: true,
        showLabel: false
      },
      axisY: {
        offset: 200,
        showGrid: false,
        showLabel: true
      }
    }
  
    const wordFrequency = topics.keywords.map(keyword => ({ text: keyword.name, value: keyword.count }))

    const keywordData = {}

    if (topics.keywords) {
      keywordData.labels = topics.keywords.map(keyword => keyword.name)
      keywordData.series = [topics.keywords.map(keyword => keyword.count)]
    }

    const topicsData = {}

    if (topics.topics) {
      topicsData.labels = topics.topics.map(topic => topic.name)
      topicsData.series = [topics.topics.map(topic => topic.count)]
    }

    return (
      <>
        <hr/>
        <h2 className='text-primary'><i className='ion-md-pricetag mr-2'/> Topics</h2>
        <p className='lead'>
          Topics identified using Natural Language Processing (NLP)
        </p>
        <p>
          {/* Found <span className='badge badge-pill badge-info'>{topics.keywords.length} keywords</span> and identified <span className='badge badge-pill badge-info'>{topics.topics.length} topics</span> that may be related to the article. */}
          Found <span className='badge badge-pill badge-info'>{topics.keywords.length} topics</span> on this page.
        </p>
        <div className='row'>
          <div className='col-md-12'>
            {/* <h4>Keywords</h4> */}
            <hr/>
            {(!topics.keywords || topics.keywords.length === 0) && <p className='text-muted'>No keywords found.</p>}
            { topics.keywords && topics.keywords.length > 0 &&
              <div className='rounded border mb-3'>
                <ChartistGraph
                  type={'Bar'}
                  className={'topics__chart'}
                  style={{height: `${(topics.keywords.length * 30)+30}px`}}
                  options={options}
                  data={keywordData}
                  />
              </div>
            }
          </div>
          {/* <div className='col-md-6'>
            <h4>Topics</h4>
            <hr/>
            {(!topics.topics || topics.topics.length === 0) && <p className='text-muted'>No topics identified.</p>}
            { topics.topics && topics.topics.length > 0 &&
              <>
                <ChartistGraph
                  type={'Bar'}
                  className={'topics__chart'}
                  style={{height: `${(topics.topics.length * 30)+30}px`}}
                  options={options}
                  data={topicsData}
                  />
              </>
            }
          </div> */}
        </div>
        {/*
        <div className='row'>
          <div className='col-md-12'>
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
        </div>
        */ }
        {/* <div className='row'>
          <div className='col-md-12'>
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
        </div> */}
      </>
    )
  }
}