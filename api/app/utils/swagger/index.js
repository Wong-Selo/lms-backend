const basicInfo = require('./basicInfo')
const tags = require('./tags')
const authDoc = require('./Auth/')
const userDoc = require('./User/')

const openApiDocumentaion = {
  ...basicInfo,
  ...tags,
  paths: {
    ...authDoc.paths,
    ...userDoc.paths
  }
}

module.exports = openApiDocumentaion
