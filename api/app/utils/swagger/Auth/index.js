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
    }
  }
}

module.exports = authDoc
