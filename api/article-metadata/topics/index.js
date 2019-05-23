const { send } = require('micro')
const microQuery = require('micro-query')
const fetch = require('node-fetch')
const unfluff = require('unfluff')
const nlp = require('compromise')
const { findTitles } = require('entity-finder')
const googleTrendsApi = require('google-trends-api')
const stopwords = require('stopwords-en')
const mostCommon = require('most-common')

const fetchOptions = require('../content/fetch-options')

// @FIXME This contains a lot of English language specific logic!
module.exports = async (req, res) => {
  const query = microQuery(req)

  if (!query.url)
    return send(res, 400, { error: 'URL parameter missing' })

  // Fetch page
  const fetchRes = await fetch(query.url, fetchOptions)
  const text = await fetchRes.text()
  const structuredData = unfluff(text)

  // Build word list
  const words = [ 
    structuredData.title,
    structuredData.description,
    structuredData.tags,
    structuredData.text,
  ].join(' ').replace(/[^A-z0-9\-' ]/mg, '')

  const wordOccurances = mostCommon(words.split(' '))
  let keywords = []
  getKeywords(words).forEach(word => { 
    wordOccurances.forEach(wordOccurance => {
      // Only add 'keywords' that have occured at least twice 
      if (wordOccurance.token === word && wordOccurance.count > 1)
        keywords.push({
          name: word,
          count: wordOccurance.count
        })
    })
  })

  // Build topic list
  let topics = []
  nlp(words).topics().out('freq').map(async(topic) => {
    // Only include topics with more than one mention
    if (topic.count > 1) {
      let name = topic.normal

      // Ignore strings like 'Ms Smith' or 'Mr Smith' as these
      // tends to create false positives (and the full name of
      // the person is typically referenced at least once too)
      if (name.split(' ').length == 2 && name.match(/^(mr|ms|mrs|dr) /i))
        return

      const matches = words.match(new RegExp(name.replace(/[^A-z0-9\-' ]/, ''), 'img'))
      if (matches && matches[0]) {
        name = matches[0]
      }

      topics.push({
        name: name,
        count: topic.count
      })
    }
  })

  if (structuredData.tags) {
    structuredData.tags.map(async tag => {
      topics.push({
        name: tag
      })
    })
  }

  let topicsWithDetail = []
  await Promise.all(
    topics.map(async topic => {
      return await new Promise(async (resolve) => {
        const relatedTopics = await getRelatedTopics(topic.name)

        if (relatedTopics.default && relatedTopics.default.rankedList[0].rankedKeyword[0]) {
          const googleTopic = relatedTopics.default.rankedList[0].rankedKeyword[0].topic
          const wikipediaData = await getWikipediaEntities([googleTopic.title])

          let name = googleTopic.title
          let count = topic.count
          let description = (wikipediaData[0]) ? wikipediaData[0].description : googleTopic.type
          let url = (wikipediaData[0]) ? wikipediaData[0].url : null
          
          topicsWithDetail.push({
            name,
            description,
            url,
            count
          })
        } else {
          const wikipediaData = await getWikipediaEntities([topic.name])

          let name = topic.name
          let count = topic.count
          let description = (wikipediaData[0]) ? wikipediaData[0].description : null
          let url = (wikipediaData[0]) ? wikipediaData[0].url : null

          const matches = words.match(new RegExp(name.replace(/[^A-z0-9\-' ]/, ''), 'img'))
          if (matches && matches[0]) {
            name = matches[0]
          }

          topicsWithDetail.push({
            name,
            description,
            url,
            count
          })
        }
        return resolve()
      })
    })
  )
  topics = topicsWithDetail
  
  // Deduplicate and filter topics
  let filteredTopics = {}
  topics.map(topic => {
    // If no URL, push from topic into keyword
    if (topic.url === null) {

      let alreadyInKeywords = false
      keywords.forEach((keyword, i) => {
        if (keyword.name.toLowerCase() === topic.name.toLowerCase()) {
          alreadyInKeywords = true

          if (!keyword.count && topic.count)
            keywords[i].count = topic.count

          if (keyword.name === topic.name.toLowerCase())
            keywords[i].name = topic.name
        }
      })

      if (alreadyInKeywords !== true)
        keywords.push(topic)
        
      return
    }

    if (!filteredTopics[topic.url]) {
      filteredTopics[topic.url] = topic
    } else {
      filteredTopics[topic.url].count = topic.count
    }
  })
  topics = Object.keys(filteredTopics).map(topic => { return filteredTopics[topic] })  

  // Sort topics by total count
  topics.sort((a, b) => { return b.count - a.count })
  keywords.sort((a, b) => { return b.count - a.count })
  /*
  keywords = keywords.filter((keyword, i) => {
    let keywordMatchesATopicName = false

    topics.map(topic => {
      if (keyword.name === topic.name) {
        keywordMatchesATopicName = true
      }
    })

    return (keywordMatchesATopicName) ? false : keyword
  })
  */

  let keywordsWithUrls = []
  //keywords.forEach(async (keyword,i) => {
  for (let i in keywords) {
    const keyword = keywords[i]
    const wikipediaData = await getWikipediaEntities([keyword.name])
    if (wikipediaData[0]) {
      keyword.url = `http://en.wikipedia.org/wiki/${keyword.name.replace(/ /g, '_')}`
    }
    keywordsWithUrls.push(keyword)
  }
  keywords = keywordsWithUrls
  
  const response = {
    url: query.url,
    topics,
    keywords
  }
  
  return send(res, 200, response)
}

function getKeywords(text) {
  const consecutiveCapitalizedWordsRegexp = /([A-Z][a-zA-Z0-9-]*)([\s][A-Z][a-zA-Z0-9-]*)+/gm
  const consecutiveCapitalizedWords = text.match(consecutiveCapitalizedWordsRegexp)
  const capitalizedWordsRegexp = /([A-Z][a-zA-Z0-9-]*)/gm
  const capitalizedWords = text.match(capitalizedWordsRegexp)

  // Start with all the consecutive capitalized words as possible entities
  let keywords = consecutiveCapitalizedWords || []

  // Strip the prefix "The " from words names
  keywords.forEach((word, index) => {
    if (word.startsWith("The "))
      keywords[index] = word.replace(/^The /, '')
  })

  // Next, add all the individually capitalized words
  if (capitalizedWords) {
    capitalizedWords.forEach(word => {
      keywords.push(word)
    })
  }
  
  // Remove duplicates
  keywords = cleanWords(keywords)

  return keywords
}

function cleanWords(array) {
  let arrayWithoutDuplicates = []
  array.forEach(item => {
    // Check if we have added this item already and length is > 3
    if (!arrayWithoutDuplicates.includes(item) && item.length > 3)
      arrayWithoutDuplicates.push(item)
  })

  // If the item is part of any other (larger) item, don't include it,
  // only include the more specific item.
  // e.g. 'Theresa May' is part of 'Prime Minister Theresa May'
  let arrayWithOnlyMostSpecificItems = []
  arrayWithoutDuplicates.forEach(item => {
    let addItem = true
    arrayWithoutDuplicates.forEach((possibleDuplicateItem) => {
      if (item !== possibleDuplicateItem && possibleDuplicateItem.includes(item)) {
        addItem = false
      } else {
      }
    })

    if (addItem === true)
      arrayWithOnlyMostSpecificItems.push(item)
  })

  let arrayWithoutStopWords = []
  arrayWithOnlyMostSpecificItems.forEach(item => {
    if (!stopwords.includes(item.toLowerCase()))
      arrayWithoutStopWords.push(item)
  })

  return arrayWithoutStopWords
}

async function getRelatedTopics(keywords) {
  try {
    const json = await googleTrendsApi.relatedTopics({
      keyword: keywords,
      category: 16 // News
    })
    return Promise.resolve(JSON.parse(json))
  } catch (e) {
    return Promise.resolve({})
  }
}

async function getWikipediaEntities(concepts) {
  const wikipediaData = await Promise.all(
    // Limit to 100 tags
    concepts.slice(0,100).map(concept => {
      return findTitles(concept, 'en', { limit: 1 })
    })
  )

  let entities = []
  wikipediaData.forEach(entity => {
    if (entity[0] && entity[0].title.length > 3)
      entities.push({
        name: (entity[0].simple) ? entity[0].simple : entity[0].title,
        description: entity[0].description,
        url: `http://en.wikipedia.org/wiki/${entity[0].title.replace(/ /g, '_')}`
      })
  })

  return entities
}

