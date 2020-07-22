const OtherObject = {
  parameters: {
    token: {
      name: 'token',
      in: 'header',
      schema: {
        type: 'string',
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3V1aWQiOiIzYzU5ZGMwNDhlODg1MDI0M2JlODA3OWE1Yzc0ZDA3OSIsImVtYWlsIjoiaGVsbG9AZ21haWwuY29tIiwiaXNfYWN0aXZlIjoxLCJpYXQiOjE1OTQ4NzgxNzF9.SaUCVtKVkuTuanIcG-DFgI_Y_6BHS0NILOHskGR0iGI'
      },
      required: false
    },
    q: {
      name: 'q',
      in: 'query',
      schema: {
        type: 'string',
        example: 'user foo'
      },
      required: false
    },
    limit: {
      name: 'limit',
      in: 'query',
      schema: {
        type: 'integer',
        example: 10
      },
      required: false
    },
    offset: {
      name: 'offset',
      in: 'query',
      schema: {
        type: 'integer',
        example: 0
      },
      required: false
    },
    userId: {
      name: 'userId',
      in: 'path',
      schema: {
        type: 'string',
        example: 'ce7aa07a-6066-46d7-a3a2-b9b3fe9c6e6b'
      }
    },
    groupId: {
      name: 'groupId',
      in: 'path',
      schema: {
        type: 'string',
        example: 'ce7aa07a-6066-46d7-a3a2-b9b3fe9c6e6b'
      }
    },
    quizId: {
      name: 'quizId',
      in: 'path',
      schema: {
        type: 'string',
        example: 'c038b2c9-b973-4113-a35f-8e86000a8794'
      }
    }
  },
  responses: {
    '200': {
      description: 'OK'
    },
    '400': {
      description: 'Error'
    },
    '404': {
      description: 'Not Found'
    }
  }
}

module.exports = OtherObject
