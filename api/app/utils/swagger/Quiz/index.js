const schemas = require('./schema')
const { responses, parameters } = require('../other')
const { token, quizId } = parameters
const { CreateQuiz } = schemas

const quizDoc = {
  paths: {
    '/quizzes/create': {
      post: {
        tags: ['Quizzes'],
        description: 'Create Quiz',
        parameters: [token],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                ...CreateQuiz
              },
              required: ['name', 'description', 'duration', 'is_private']
            }
          }
        },
        responses: { ...responses }
      }
    },
    '/quizzes/list': {
      get: {
        tags: ['Quizzes'],
        description: 'Get created Quiz',
        parameters: [token],
        responses: { ...responses }
      }
    },
    '/quizzes/detail/{quizId}': {
      get: {
        tags: ['Quizzes'],
        description: 'Get detail Quiz',
        parameters: [token, quizId],
        responses: { ...responses }
      }
    }
  }
}

module.exports = quizDoc
