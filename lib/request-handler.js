// Setting these handlers here for each endpoint makes maintenance easier
const { send } = require('micro')
const microQuery = require('micro-query')

const sendResponse = (res, statusCode, message) => {
  res.setHeader('Cache-Control', `public,max-age=60,s-maxage=${60 * 60}`)
  return send(res, statusCode, message)
}

module.exports = {
  queryParser: microQuery,
  send: sendResponse
}