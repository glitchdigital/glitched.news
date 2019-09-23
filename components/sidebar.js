import React from "react"
import classnames from "classnames"

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
      <div className="sidebar-sticky">
        <h5 className="sidebar__heading text-muted p-2 mt-2 text-uppercase font-weight-bold">{rootUrl || 'Navigation' }</h5>
        <h5 className="sidebar__heading bg-secondary text-white p-2 mt-2 text-uppercase font-weight-bold">Article analysis</h5>
        <ul className="nav nav-pills flex-column">
        { Object.keys(sidebarItems).map(item => 
          <li key={`sidebar-${item}`} className="nav-item"><a onClick={onClickHandler} className={classnames('nav-link rounded-0', currentSection === item ? 'active' : 'text-dark')} href={`#${item}`}>{sidebarItems[item]}</a></li>
        )}
        </ul>
      </div>
    )
  }
}