const fields = {
  name: { type: 'string', example: 'Group Foo' },
  description: { type: 'string', example: 'Lorem ipsum dolor' },
  max_member: { type: 'integer', example: 12 },
  group_uuid: { type: 'string', example: 'uuid-1234-1234-1234' },
  user_uuid: { type: 'string', example: 'uuid-1234-1234-1234' }
}

const schemas = {
  CreateUpdateGroup: {
    type: 'object',
    properties: {
      name: {
        ...fields.name
      },
      description: {
        ...fields.description
      },
      max_member: {
        ...fields.max_member
      }
    }
  },
  AddRemoveMember: {
    type: 'object',
    properties: {
      group_uuid: {
        ...fields.group_uuid
      },
      user_uuid: {
        ...fields.user_uuid
      }
    }
  }
}

module.exports = schemas
