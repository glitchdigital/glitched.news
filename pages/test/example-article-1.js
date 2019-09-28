import React from 'react'
import Head from 'next/head'

export default () => (
  <>
    <Head>
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:site" content="@twitter"/>
      <meta name="twitter:title" content="Title text…"/>
      <meta name="twitter:description" content="Description text…"/>
      <meta name="twitter:creator" content="@twitter"/>
      <meta name="twitter:image" content="http://example.com/image.png"/>
      <meta name="twitter:image:alt" content="Description of image"/>
      <meta name="twitter:domain" content="example.com"/>
    </Head>
    <h1>Example Article 1</h1>
    <p>
      This is an example article.
    </p>
    <p>
      This sentence contains the word happy and is positive.
    </p>
    <p>
      This sentence contains the word sad and is negative.
    </p>
    <script type="application/ld+json" dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "http://schema.org",
        "@type": "NewsArticle",
        "headline": "Example Headline",
        "author": "A Smith",
        "url": "http://example.com/path-to-article",
        "image": "http://example.com/path-to-article-image.jpg",
        "datePublished": "2019-01-01",
        "publisher": {
          "@type": "Organization",
          "name": "ACME News",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.example.com/logo.png"
          }
        }
      })
    }}/>
  </>
)