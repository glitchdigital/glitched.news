// Some sites publishing articles they know are false or misleading
// try to avoid detection by returning different response
// (or nothing at all) if it thinks the client is not a real
// browser, so we emulate a browser.

// @TODO Use a wider range of headers and rotate between different
// valid (and current) user agents.
module.exports = {
  /*
  headers: {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36.'
  }
  */
}