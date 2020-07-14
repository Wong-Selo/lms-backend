require('dotenv').config()

const date = new Date()
const fileName = `./logs/core-system-${date.toISOString().substring(0, 10)}.log`
const internalLogger = require('pino')(
  {
    name: 'Log System',
    level: process.env.API_LOG_LEVEL
  },
  fileName
)

module.exports = internalLogger
