const schemas = require('./schema')
const { responses, parameters } = require('../other')
const { token, groupId } = parameters
const { CreateUpdateGroup, AddRemoveMember } = schemas

const groupDoc = {
  paths: {
    '/groups/create': {
      post: {
        tags: ['Groups'],
        description: 'Create Group',
        parameters: [token],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                ...CreateUpdateGroup,
                required: ['name']
              }
            }
          }
        },
        responses: { ...responses }
      }
    },
    '/groups/group/edit/{groupId}': {
      put: {
        tags: ['Groups'],
        description: 'Update Group',
        parameters: [token, groupId],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                ...CreateUpdateGroup
              }
            }
          },
          required: true
        },
        responses: { ...responses }
      }
    },
    '/groups/member/add': {
      post: {
        tags: ['Groups'],
        description: 'Add member to Group',
        parameters: [token],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                ...AddRemoveMember
              }
            }
          },
          required: true
        },
        responses: { ...responses }
      }
    },
    '/groups/member/delete': {
      delete: {
        tags: ['Groups'],
        description: 'Remove member from Group',
        parameters: [token],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                ...AddRemoveMember
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

module.exports = groupDoc
