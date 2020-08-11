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
  }
}

const { name, email, password } = fields

const schemas = {
  SignIn: {
    type: 'object',
    properties: {
      email: { ...email },
      password: { ...password }
    }
  },
  SignUp: {
    type: 'object',
    properties: {
      name: { ...name },
      email: { ...email },
      password: { ...password },
      confirm_password: { ...password }
    }
  }
}

module.exports = schemas
