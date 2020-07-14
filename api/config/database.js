const { Pool } = require('pg')

module.exports = {
  connectDB: () => {
    const connection = new Pool({
      user: process.env.DB_USERNAME,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      max: 10
    })
    return connection
  }
}
