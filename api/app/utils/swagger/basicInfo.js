const basicInfo = {
  openapi: '3.0.1',
  info: {
    version: '1.3.0',
    title: 'Wong Selo - LMS API',
    description: 'API documentations for LMS'
  },
  servers: [
    {
      url: 'http://localhost:8000/api/',
      description: 'Local server'
    },
    {
      url: 'http://3.90.21.8:8000/api/',
      description: 'Dev server'
    }
  ]
}

module.exports = basicInfo
