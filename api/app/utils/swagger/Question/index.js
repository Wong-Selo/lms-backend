const schemas = require('./schema')
const { responses, parameters } = require('../other')
const { token, questionId } = parameters
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
    },
    '/questions/detail/{questionId}': {
      get: {
        tags: ['Questions'],
        description: 'Get detail Qestion',
        parameters: [token, questionId],
        responses: { ...responses }
      }
    },
    '/questions/delete/{questionId}': {
      delete: {
        tags: ['Questions'],
        description: 'Delete question',
        parameters: [token, questionId],
        responses: { ...responses }
      }
    }
  }
}

module.exports = quizDoc
