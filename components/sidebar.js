import React from 'react'
import classnames from 'classnames'

const sidebarItems = {
  ['article-summary']: 'Summary' ,
  ['article-trust']: 'Trust indicators',
  ['article-sentiment']: 'Sentiment analysis',
  ['article-factcheck']: 'Facts, figures & quotes',
  ['article-topics']: 'Topics & keywords',
  //['article-social']: 'Social media',
  ['article-structured-data']: 'Structured data',
  ['article-links']: 'Links',
  ['article-related']: 'Related articles',
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
        { Object.keys(sidebarItems).map(item => 
          <li key={`sidebar-${item}`} className='small nav-item'><a onClick={onClickHandler} className={classnames('nav-link rounded-0', currentSection === item ? 'active' : 'text-dark')} href={`#${item}`}>{sidebarItems[item]}</a></li>
        )}
        </ul>
      </div>
    )
  }
}