import React from 'react'
import classnames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faFileAlt } from '@fortawesome/free-solid-svg-icons'

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
        <a className={classnames('d-block sidebar__heading p-2 mt-2 border-bottom border-top text-uppercase font-weight-bold text-decoration-none', currentSection === 'homepage' ? 'bg-primary text-white' : 'bg-white text-primary border-right')} onClick={onClickHandler} href='#homepage'>
          <FontAwesomeIcon border icon={faGlobe} style={{height: '1em'}} className='mr-1'/> {rootUrl || 'Navigation' }
        </a>
        <h5 className='sidebar__heading text-muted p-2 mt-2 text-uppercase font-weight-bold'>
          <FontAwesomeIcon border icon={faFileAlt} style={{height: '1em'}} className='mr-1'/> Article analysis
        </h5>
        <ul className='nav nav-pills flex-column'>
        { Object.keys(sidebarItems).map(item => 
          <li key={`sidebar-${item}`} className='nav-item'><a onClick={onClickHandler} className={classnames('nav-link rounded-0', currentSection === item ? 'active' : 'text-dark')} href={`#${item}`}>{sidebarItems[item]}</a></li>
        )}
        </ul>
      </div>
    )
  }
}