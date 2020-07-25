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
  security: [{
    ApiKeyAuth: []
  }],
  paths: {
    ...authDoc.paths,
    ...userDoc.paths,
    ...profileDoc.paths,
    ...groupDoc.paths,
    ...quizDoc.paths,
    ...questionDoc.paths
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        description: `put header with name "token". Token value got from sign-in end-point. Please read authentication end-points`,
        type: "apiKey",
        name: "token",
        in: "header"
      }
    }
  }
}

module.exports = openApiDocumentaion
