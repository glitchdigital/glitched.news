import React from 'react'

import cloneObject from 'lib/clone-object'
import Indicator from 'components/indicator/gauge'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.pieChartDefaults = {
      options: {
        donut: true,
        donutWidth: 50,
        donutSolid: true,
        startAngle: 270,
        total: 200
      },
      data: {
        labels: [ ' ', ' ', ' ' ],
        series: [{
          value: 0,
          name: 'Neg',
          className: 'indicator__piechart--negative'
        },
        {
          value: 0,
          name: 'Neu',
          className: 'indicator__piechart--neutral'
        },
        {
          value: 0,
          name: 'Pos',
          className: 'indicator__piechart--positive'
        }]
      }
    }
  }
  
  render() {
    const { sentiment } = this.props

    if (!sentiment) return null

    const pieCharts = {
      headline: cloneObject(this.pieChartDefaults),
      text: cloneObject(this.pieChartDefaults),
      overall: cloneObject(this.pieChartDefaults),
      sentence: cloneObject(this.pieChartDefaults)
    }

    let negativeSentences = 0
    let neutralSentences = 0
    let positiveSentences = 0
    sentiment.sentences.map(sentence => {
      if (sentence.pos > sentence.neg) {
        positiveSentences++
      } else if (sentence.neg > sentence.pos) {
        negativeSentences++
      } else {
        neutralSentences++
      }
    })
    pieCharts.sentence.data.series[0].value = Math.round(negativeSentences / sentiment.sentences.length * 100)
    pieCharts.sentence.data.series[1].value = 100 - (Math.round(negativeSentences / sentiment.sentences.length * 100) + Math.round(positiveSentences / sentiment.sentences.length * 100))
    pieCharts.sentence.data.series[2].value = Math.round(positiveSentences / sentiment.sentences.length * 100)

    if (pieCharts.sentence.data.series[0].value > 10)
      pieCharts.sentence.data.labels[0] = `${pieCharts.sentence.data.series[0].value}%`
    if (pieCharts.sentence.data.series[2].value > 10)
      pieCharts.sentence.data.labels[2] = `${pieCharts.sentence.data.series[2].value}%`

    let sentimentText = 'This article contains mostly neutral sentences.'
    if (positiveSentences > neutralSentences && positiveSentences > negativeSentences) {
      sentimentText = 'This article contains mostly positive sentences.'
    } else if (negativeSentences > neutralSentences && negativeSentences > positiveSentences) { 
      sentimentText = 'This article contains mostly negative sentences.'
    }

    ['headline', 'text', 'overall'].forEach(chart => {
      if (sentiment[chart]) {
        pieCharts[chart].options.total = (Math.round(sentiment[chart].neg * 100) + Math.round(sentiment[chart].neu * 100) + Math.round(sentiment[chart].pos * 100)) * 2
        
        pieCharts[chart].data.series[0].value = Math.round(sentiment[chart].neg * 100)
        pieCharts[chart].data.series[1].value = 100 - (Math.round(sentiment[chart].neg * 100) + Math.round(sentiment[chart].pos * 100))
        pieCharts[chart].data.series[2].value = Math.round(sentiment[chart].pos * 100)

        pieCharts[chart].data.labels = [
          `${pieCharts[chart].data.series[0].value}%`,
          `${pieCharts[chart].data.series[1].value}%`,
          `${pieCharts[chart].data.series[2].value}%` 
        ]
      } else {
        pieCharts[chart].options.total = 200

        pieCharts[chart].data.series[0].value = 0
        pieCharts[chart].data.series[1].value = 100
        pieCharts[chart].data.series[2].value = 0

        pieCharts[chart].data.labels = [ 0, 100, 0 ]
      }
    })

    return (
      <>
        <hr/>
        <h3>Sentiment analysis</h3>
        <p className='text-muted'>
          Sentiment analysis for English language articles.
        </p>
        <h4>Overall impression</h4>
        <p className='lead'>
          Sentiment analysis of the headline and article text.
        </p>
        <div className='row'>
          <div className='col-sm-4'>
            <Indicator
              label='Headline'
              {...pieCharts.headline}
            />
          </div>
          <div className='col-sm-4'>
            <Indicator
              label='Article text'
              {...pieCharts.text}
            />
          </div>
          <div className='col-sm-4'>
            <Indicator
              label='Headline and text'
              {...pieCharts.overall}
            />
          </div>
        </div>
        <hr/>
        <h4>Sentence analysis</h4>
        <p className='lead'>
          Sentence analysis looks at the sentiment of each sentence in isolation.
        </p>
        <div className='row mt-3'>
          <div className='col-sm-4'>
            <Indicator
              label='Sentence sentiment'
              {...pieCharts.sentence}
            />
          </div>
          <div className='col-sm-8 pt-3'>
            <p className='font-weight-bold'>{sentimentText}</p>
            <ul>
              <li><strong>{pieCharts.sentence.data.series[0].value}%</strong> of sentences appear negative</li>
              <li><strong>{pieCharts.sentence.data.series[1].value}%</strong> of sentences appear neutral</li>
              <li><strong>{pieCharts.sentence.data.series[2].value}%</strong> of sentences appear positive</li>
            </ul>
            <p className='text-muted'>
              Results of sentiment analysis on each sentence in isolation may yield different results to overall analysis of the text of an article.
            </p>
          </div>
        </div>
      </>
    )
  }
}