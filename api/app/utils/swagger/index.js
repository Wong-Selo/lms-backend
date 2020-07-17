const basicInfo = require('./basicInfo')
const tags = require('./tags')
const authDoc = require('./Auth/')

const openApiDocumentaion = {
  ...basicInfo,
  ...tags,
  ...authDoc
}

module.exports = openApiDocumentaion
