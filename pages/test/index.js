import React from 'react'
import Link from 'next/link'

export default () => (
  <>
    <h1>Example News Site</h1>
    <ul>
      <li><Link href="/test/example-article-1"><a>Example Article 1</a></Link></li>
      <li><Link href="/test/example-article-2"><a>Example Article 2</a></Link></li>
    </ul>
  </>
)