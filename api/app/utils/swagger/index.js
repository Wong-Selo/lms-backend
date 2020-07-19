const basicInfo = require('./basicInfo')
const tags = require('./tags')
const authDoc = require('./Auth')
const userDoc = require('./User')
const profileDoc = require('./Profile')
const groupDoc = require('./Group')

const openApiDocumentaion = {
  ...basicInfo,
  ...tags,
  paths: {
    ...authDoc.paths,
    ...userDoc.paths,
    ...profileDoc.paths,
    ...groupDoc.paths
  }
}

module.exports = openApiDocumentaion
