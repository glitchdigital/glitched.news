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
  ['article-links']: 'Links from this article',
  ['article-related']: 'Related articles',
}

export default class extends React.Component {
  render() {
    const { currentSection, onClickHandler } = this.props
    return (
      <div className="sidebar-sticky">
        <h5 className="sidebar__heading text-muted">Navigation</h5>
        <ul className="nav flex-column">
        { Object.keys(sidebarItems).map(item => 
          <li key={`sidebar-${item}`} className="nav-item"><a onClick={onClickHandler} className={classnames('nav-link', currentSection === item ? 'active bg-primary text-white' : 'text-dark')} href={`#${item}`}>{sidebarItems[item]}</a></li>
        )}
        </ul>
      </div>
    )
  }
}