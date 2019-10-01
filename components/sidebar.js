import React from 'react'
import classnames from 'classnames'

const sidebarItems = {
  ['article-summary']: {
    text: 'Summary',
    icon: 'ion-md-clipboard'
  },
  ['article-trust']: {
    text: 'Trust indicators',
    icon: 'ion-md-checkmark-circle-outline'
  },
  ['article-sentiment']: {
    text: 'Sentiment analysis',
    icon: 'ion-md-podium'
  },
  ['article-factcheck']: {
    text: 'Facts & citations',
    icon: 'ion-md-quote'
  },
  ['article-topics']: {
    text: 'Topics & keywords',
    icon: 'ion-md-pricetag'
  },
  ['article-structured-data']: {
    text: 'Structured data',
    icon: 'ion-md-analytics'
  },
  ['article-links']: {
    text: 'Links',
    icon: 'ion-md-link'
  },
  ['article-related']: {
    text: 'Related articles',
    icon: 'ion-md-albums'
  },
}

export default class extends React.Component {
  render() {
    const { rootUrl, currentSection, onClickHandler } = this.props
    return (
      <div className='sidebar-sticky'>
        <a className={classnames('d-block sidebar__heading p-2 text-lowercase font-weight-bold text-decoration-none', currentSection === 'homepage' ? 'bg-primary text-white' : 'text-primary')} onClick={onClickHandler} href='#homepage'>
          {rootUrl ? rootUrl.replace(/^www\./, '') : 'Navigation' }
        </a>
        <h6 className='sidebar__heading text-muted p-2 pt-3 text-uppercase font-weight-bold border-top'>
         Article analysis
        </h6>
        <ul className='nav nav-pills flex-column'>
        { Object.keys(sidebarItems).map((item,i) => 
          <li key={`sidebar-${i}-${item.text}`} className='nav-item'>
            <a onClick={onClickHandler} className={classnames('nav-link rounded-0', currentSection === item ? 'active' : 'text-dark')} href={`#${item}`}>
            <i className={`${sidebarItems[item].icon} mr-1`}/> {sidebarItems[item].text}
            </a>
          </li>
        )}
        </ul>
      </div>
    )
  }
}