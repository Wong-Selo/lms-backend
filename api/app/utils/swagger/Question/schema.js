const fields = {
  quiz_uuid: {
    type: 'string',
    example: 'group-1234-1234'
  },
  questions: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          example: 'Siapa presiden pertama Indonesia?'
        },
        type: {
          type: 'string',
          example: 'multiple'
        },
        choices: {
          type: 'array',
          items: {
            type: 'string',
            example: [
              'Ir. Soekarno',
              'Soeharto',
              'B.J. Habibie',
              'Ir. Joko Widodo'
            ]
          }
        },
        answer: {
          type: 'string',
          example: 'Ir. Soekarno'
        }
      }
    },
    example: [
      {
        content: 'Siapa presiden pertama Indonesia?',
        type: 'short_answer',
        answer: 'Ir. Soekarno'
      },
      {
        content: 'Hasil dari perkalian 12 dengan 2 adalah ...',
        type: 'multiple',
        choices: ['24', '12', '0', '1'],
        answer: '24'
      },
      {
        content: 'Menurut anda siapa dalang G30S/PKI? Jelaskan!',
        type: 'essay',
        answer: 'Lorem ipsum dolor sit amet'
      }
    ]
  }
}

const { name, email, password } = fields

const schemas = {
  CreateQuestion: {
    type: 'object',
    properties: {
      ...fields
    }
  }
}

module.exports = schemas
