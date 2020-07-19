const schemas = require('./schema')
const { responses, parameters } = require('../other')
const { token } = parameters
const { UpdateProfile } = schemas

const profileDoc = {
  paths: {
    '/profiles': {
      get: {
        tags: ['Profiles'],
        description: 'Get detail profile by logged user',
        parameters: [token],
        responses: { ...responses }
      }
    },
    '/profiles/update': {
      put: {
        tags: ['Profiles'],
        description: 'Update profile by logged user',
        parameters: [token],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                ...UpdateProfile,
                required: ['bio']
              }
            }
          }
        },
        responses: { ...responses }
      }
    }
  }
}

module.exports = profileDoc
