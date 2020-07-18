const fields = {
  name: {
    type: 'string',
    example: 'Foo'
  },
  email: {
    type: 'string',
    example: 'foo@bar.com'
  },
  password: {
    type: 'string',
    example: 's3crEt'
  },
  is_active: {
    type: 'integer',
    example: 1
  }
}

const { name, email, password } = fields

const schemas = {
  CreateUser: {
    type: 'object',
    properties: {
      name,
      email,
      password
    }
  },
  UpdateUser: {
    type: 'object',
    properties: {
      ...fields
    }
  }
}

module.exports = schemas
