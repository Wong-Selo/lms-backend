const schemas = require('./schema')
const { responses, parameters } = require('../other')
const { token, limit, offset, q, userId } = parameters
const { CreateUser, UpdateUser } = schemas

const userDoc = {
  paths: {
    '/users/list': {
      get: {
        tags: ['Users'],
        description: 'List users',
        parameters: [token, limit, offset, q],
        responses: { ...responses }
      }
    },
    '/users/detail/{userId}': {
      get: {
        tags: ['Users'],
        description: 'Get user by userId',
        parameters: [token, userId],
        responses: { ...responses }
      }
    },
    '/users/create/': {
      post: {
        tags: ['Users'],
        description: 'Create user',
        parameters: [token],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                ...CreateUser
              }
            }
          },
          required: true
        },
        responses: { ...responses }
      }
    },
    '/users/delete/{userId}': {
      delete: {
        tags: ['Users'],
        description: 'Delete user by userId',
        parameters: [token, userId],
        responses: { ...responses }
      }
    },
    '/users/update/{userId}': {
      put: {
        tags: ['Users'],
        description: 'Delete user by userId',
        parameters: [token, userId],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                ...UpdateUser,
                required: ['name']
              }
            }
          }
        },
        responses: { ...responses }
      }
    }
  }
}

module.exports = userDoc
