const fields = {
  group_uuid: {
    type: 'string',
    example: 'group-1234-1234'
  },
  name: {
    type: 'string',
    example: 'Quiz Pertemuan 1'
  },
  description: {
    type: 'string',
    example: 'Quiz untuk mengetahuai pemahaman tentang sistem reproduksi'
  },
  duration: {
    type: 'integer',
    example: 120
  },
  is_private: {
    type: 'integer',
    example: 1
  }
}

const { name, email, password } = fields

const schemas = {
  CreateQuiz: {
    type: 'object',
    properties: {
      ...fields
    }
  }
}

module.exports = schemas
