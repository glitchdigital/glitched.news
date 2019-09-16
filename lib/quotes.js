function getQuotes(text) {
  let normalizedtext = text

  // Normalize English quotation marks
  normalizedtext = normalizedtext.replace(/[“”]/g, '"')

  // Normalize German quotation marks
  normalizedtext = normalizedtext.replace(/[„“]/g, '"')

  // Normalize French quotation marks
  normalizedtext = normalizedtext.replace(/[«»]/g, '"')

  const rawQuotes = normalizedtext.match(/(["])(\\?.)*?\1/gm) || []
  let quotes = []
  
  rawQuotes.forEach(quote => {
    const trimmedQuote = quote.replace(/( )*"( )*/, '"')
    quotes.push(trimmedQuote)
  })
  
  return getUniqueQuotes(quotes)
}

function getUniqueQuotes(quotes) {
  let uniqueQuotes = {}

  quotes.forEach(quote => {
    const key = quote.toLowerCase()
    uniqueQuotes[key] = quote
  })

  return Object.values(uniqueQuotes)
}

module.exports = {
  getQuotes,
  getUniqueQuotes
}