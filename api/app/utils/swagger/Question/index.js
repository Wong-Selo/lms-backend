const schemas = require('./schema')
const { responses, parameters } = require('../other')
const { token } = parameters
const { CreateQuestion } = schemas

const quizDoc = {
  paths: {
    '/questions/create': {
      post: {
        tags: ['Questions'],
        description: 'Create Qestions',
        parameters: [token],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                ...CreateQuestion,
                required: ['type', 'content', 'answer']
              },
              required: ['quiz_uuid', 'questions']
            }
          }
        },
        responses: { ...responses }
      }
    }
  }
}

module.exports = quizDoc
