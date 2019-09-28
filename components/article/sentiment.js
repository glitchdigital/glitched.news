import React from 'react'
import ChartistGraph from 'react-chartist'

import cloneObject from 'lib/clone-object'

export default class extends React.Component {

  constructor(props) {
    super(props)
    this.pieChartDefaults = {
      options: {
        donut: true,
        donutWidth: 40,
        donutSolid: true,
        startAngle: 270,
        total: 100,
        showLabel: true
      },
      data: {
        labels: [ '-', ' ', '+' ],
        series: [{
          value: 0,
          name: 'Neg',
          className: 'sentiment__piechart--negative'
        },
        {
          value: 0,
          name: 'Neu',
          className: 'sentiment__piechart--neutral'
        },
        {
          value: 0,
          name: 'Pos',
          className: 'sentiment__piechart--positive'
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
    pieCharts.sentence.options.total = (negativeSentences + positiveSentences + neutralSentences) * 2
    pieCharts.sentence.data.series[0].value = negativeSentences
    pieCharts.sentence.data.series[1].value = neutralSentences
    pieCharts.sentence.data.series[2].value = positiveSentences

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
        pieCharts[chart].data.series[1].value = Math.round(sentiment[chart].neu * 100) 
        pieCharts[chart].data.series[2].value = Math.round(sentiment[chart].pos * 100)
      } else {
        pieCharts[chart].options.total = 200
        pieCharts[chart].data.series[0].value = 0
        pieCharts[chart].data.series[1].value = 100
        pieCharts[chart].data.series[2].value = 0
      }
    })

    return (
      <div className='sentiment'>
        <hr/>
        <h3>Sentiment analysis</h3>
        <h4>Overall impression</h4>
        <div className='row'>
          <div className='col-sm-4'>
            <div className='sentiment__piechart'>
              <ChartistGraph type={'Pie'} {...pieCharts.headline} />
            </div>
            <div className='sentiment__barchart ml-auto mr-auto'>
              <div className='d-inline-block sentiment__barchart--negative' style={{width: pieCharts.headline.data.series[0].value+'%'}}/>
              <div className='d-inline-block sentiment__barchart--neutral' style={{width: pieCharts.headline.data.series[1].value+'%'}}/>
              <div className='d-inline-block sentiment__barchart--positive' style={{width: pieCharts.headline.data.series[2].value+'%'}}/>
            </div>
            <h5 className='text-center text-uppercase'>Headline</h5>
            <p className='text-center'>
              <span className='sentiment__negative--highlighted'>{pieCharts.headline.data.series[0].value}%</span>
              <span className='text-muted ml-1 mr-1'>/</span>
              <span className='sentiment__neutral--highlighted'>{pieCharts.headline.data.series[1].value}%</span>
              <span className='text-muted ml-1 mr-1'>/</span>
              <span className='sentiment__positive--highlighted'>{pieCharts.headline.data.series[2].value}%</span>
            </p>
          </div>
          <div className='col-sm-4'>
            <div className='sentiment__piechart'>
              <ChartistGraph type={'Pie'} {...pieCharts.text} />
            </div>
            <div className='sentiment__barchart ml-auto mr-auto'>
              <div className='d-inline-block sentiment__barchart--negative' style={{width: pieCharts.text.data.series[0].value+'%'}}/>
              <div className='d-inline-block sentiment__barchart--neutral' style={{width: pieCharts.text.data.series[1].value+'%'}}/>
              <div className='d-inline-block sentiment__barchart--positive' style={{width: pieCharts.text.data.series[2].value+'%'}}/>
            </div>
            <h5 className='text-center text-uppercase'>Article Text</h5>
            <p className='text-center'>
              <span className='sentiment__negative--highlighted'>{pieCharts.text.data.series[0].value}%</span>
              <span className='text-muted ml-1 mr-1'>/</span>
              <span className='sentiment__neutral--highlighted'>{pieCharts.text.data.series[1].value}%</span>
              <span className='text-muted ml-1 mr-1'>/</span>
              <span className='sentiment__positive--highlighted'>{pieCharts.text.data.series[2].value}%</span>
            </p>
          </div>
          <div className='col-sm-4'>
            <div className='sentiment__piechart'>
              <ChartistGraph type={'Pie'} {...pieCharts.overall} />
            </div>
            <div className='sentiment__barchart ml-auto mr-auto'>
              <div className='d-inline-block sentiment__barchart--negative' style={{width: pieCharts.overall.data.series[0].value+'%'}}/>
              <div className='d-inline-block sentiment__barchart--neutral' style={{width: pieCharts.overall.data.series[1].value+'%'}}/>
              <div className='d-inline-block sentiment__barchart--positive' style={{width: pieCharts.overall.data.series[2].value+'%'}}/>
            </div>
            <h5 className='text-center text-uppercase'>Headline &amp; text</h5>
            <p className='text-center'>
              <span className='sentiment__negative--highlighted'>{pieCharts.overall.data.series[0].value}%</span>
              <span className='text-muted ml-1 mr-1'>/</span>
              <span className='sentiment__neutral--highlighted'>{pieCharts.overall.data.series[1].value}%</span>
              <span className='text-muted ml-1 mr-1'>/</span>
              <span className='sentiment__positive--highlighted'>{pieCharts.overall.data.series[2].value}%</span>
            </p>
          </div>
        </div>
        <hr/>
        <h4>Sentence analysis</h4>
        <div className='row mt-3'>
          <div className='col-sm-4'>
            <div className='sentiment__piechart'>
              <ChartistGraph type={'Pie'} {...pieCharts.sentence} />
            </div>
            <div className='sentiment__barchart ml-auto mr-auto'>
              <div className='d-inline-block sentiment__barchart--negative' style={{width: Math.round(negativeSentences / sentiment.sentences.length * 100)+'%'}}/>
              <div className='d-inline-block sentiment__barchart--neutral' style={{width: Math.round(neutralSentences / sentiment.sentences.length * 100)+'%'}}/>
              <div className='d-inline-block sentiment__barchart--positive' style={{width: Math.round(positiveSentences / sentiment.sentences.length * 100)+'%'}}/>
            </div>
            <h5 className='text-center text-uppercase'>Sentence Sentiment</h5>
            <p className='text-center'>
              <span className='sentiment__negative--highlighted'>{pieCharts.sentence.data.series[0].value}%</span>
              <span className='text-muted ml-1 mr-1'>/</span>
              <span className='sentiment__neutral--highlighted'>{pieCharts.sentence.data.series[1].value}%</span>
              <span className='text-muted ml-1 mr-1'>/</span>
              <span className='sentiment__positive--highlighted'>{pieCharts.sentence.data.series[2].value}%</span>
            </p>
          </div>
          <div className='col-sm-8 pt-3'>
            <p className='font-weight-bold'>{sentimentText}</p>
            <ul>
              <li>{Math.round(negativeSentences / sentiment.sentences.length * 100)}% of sentences appear negative.</li>
              <li>{Math.round(neutralSentences / sentiment.sentences.length * 100)}% of sentences appear neutral.</li>
              <li>{Math.round(positiveSentences / sentiment.sentences.length * 100)}% of sentences appear positive.</li>
            </ul>
            <p className='text-muted'>
              Sentence sentiment analysis looks at each sentence in isolation.
            </p>
          </div>
        </div>
      </div>
    )
  }
}