const schemas = require('./schema')
const { SignIn, SignUp } = schemas

const responses = {
  '200': {
    description: 'OK'
  },
  '400': {
    description: 'Error'
  }
}

token = {
  name: 'token',
  in: 'query',
  schema: {
    type: 'string',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ6YUB3YXJ1ZG8uZGlvIiwiaWF0IjoxNTE2MjM5MDIyfQ.r2Ebor2AMkm-NA890hgz1rO98Fyu5KNcFNws43prwrw'
  },
  required: true
}

const authDoc = {
  paths: {
    '/auth/sign-in': {
      post: {
        tags: ['Authentication'],
        description: 'Sign in with email and password',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                ...SignIn
              }
            }
          },
          required: ['email', 'password']
        },
        responses: { ...responses }
      }
    },
    '/auth/sign-up': {
      post: {
        tags: ['Authentication'],
        description: 'Sign up with email and password',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                ...SignUp
              }
            }
          },
          required: true
        },
        responses: { ...responses }
      }
    },
    '/auth/verify': {
      get: {
        tags: ['Authentication'],
        description: 'Activate user (email verification)',
        parameters: [token],
        responses: { ...responses }
      }
    }
  }
}

module.exports = authDoc
