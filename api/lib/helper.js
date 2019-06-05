// Setting these handlers here for each endpoint makes maintenance easier
const { send } = require('micro')
const microQuery = require('micro-query')

const addHeaders = res => {
  res.setHeader('Cache-Control', `public,max-age=60,s-maxage=${60 * 60}`)
}

module.exports = {
  addHeaders,
  queryParser: microQuery,
  send,
}