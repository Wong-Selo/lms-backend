const basicInfo = require('./basicInfo')
const tags = require('./tags')
const authDoc = require('./Auth')
const userDoc = require('./User')
const profileDoc = require('./Profile')
const groupDoc = require('./Group')
const quizDoc = require('./Quiz')
const questionDoc = require('./Question')

const openApiDocumentaion = {
  ...basicInfo,
  ...tags,
  paths: {
    ...authDoc.paths,
    ...userDoc.paths,
    ...profileDoc.paths,
    ...groupDoc.paths,
    ...quizDoc.paths,
    ...questionDoc.paths
  }
}

module.exports = openApiDocumentaion
