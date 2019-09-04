import React from "react"

export default class extends React.Component {
  render() {
    return (
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          <li className="nav-item"><a className="nav-link" href="#article-summary">Summary</a></li>
          <li className="nav-item"><a className="nav-link" href="#article-trust">Trust indicators</a></li>
          <li className="nav-item"><a className="nav-link" href="#article-sentiment">Sentiment analysis</a></li>
          <li className="nav-item"><a className="nav-link" href="#article-factcheck">Facts, figures &amp; quotes</a></li>
          <li className="nav-item"><a className="nav-link" href="#article-topics">Topics &amp; keywords</a></li>
          {/*<li className="nav-item"><a className="nav-link" href="#article-social">Social media</a></li>*/}
          <li className="nav-item"><a className="nav-link" href="#article-structured-data">Structured data</a></li>
          <li className="nav-item"><a className="nav-link" href="#article-links">Links from this article</a></li>
          <li className="nav-item"><a className="nav-link" href="#article-related">Related articles</a></li>
        </ul>
      </div>
    )
  }
}