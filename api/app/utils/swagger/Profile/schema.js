const fields = {
  bio: { type: 'string', example: 'Ini bio' },
  twitter: { type: 'string', example: 'born2stuck' },
  facebook: { type: 'string', example: 'fizikurniawan' },
  phone: { type: 'string', example: '62811111' },
  birth_date: { type: 'string', example: '1998-01-01' },
  instagram: { type: 'string', example: 'fizi.py' },
  website: { type: 'string', example: 'https://fizi.dev' }
}

const schemas = {
  UpdateProfile: {
    type: 'object',
    properties: {
      ...fields
    }
  }
}

module.exports = schemas
