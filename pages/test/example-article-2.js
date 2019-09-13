import React from 'react'

export default () => (
  <div itemscope itemtype="http://schema.org/Article">
    <h1 itemprop="headline">Example Article 2</h1>
    <p>
      Author: <span itemprop="author">A Smith</span>
    </p>
    <p>
      Published On: <span itemprop="datePublished">2019-01-01</span>
    </p>
    <img itemprop="image" src="http://example.com/path-to-article-image.jpg" alt="Image description"/>
    <p>
      Article text…
    </p>
    <div itemprop="publisher" itemscope itemtype="https://schema.org/Organization">
      <div itemprop="logo" itemscope itemtype="https://schema.org/ImageObject">
        <meta itemprop="url" content="https://www.example.com/logo.png"/>
      </div>
      <meta itemprop="name" content="ACME"/>
    </div>
    <link itemprop="url" href="http://example.com/path-to-article"/>
  </div>
)