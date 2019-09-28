module.exports = (inputUrl, baseUrl) => {
  // Strip anchor text
  let url = inputUrl.replace(/#(.*)$/, '')
  
  // Strip the trailing slash from URLs (as long as they don't have query string)
  // This is a normalization step that technical might cause problems but in
  // practice is useful for de-duping links on page.
  if (!url.includes('?'))
    url = url.replace(/\/$/, '')

  // If URL does not start with a protocol (or //:) then append base URL so the result
  // is an absolute link, rather than a relative one.
  // FIXME: There are edge cases where this approach may not be correct - eg pages that use
  // the <base> tag, but these are rarely used in practice.
  if (!url.match(/[A-z]:/) && !url.startsWith('//:')) {
    url = `${baseUrl}${url}`
  }

  return url
}