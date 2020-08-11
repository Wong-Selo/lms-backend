const DBConnection = require('@utils/database.connection')

class DBService {
  constructor() {
    this.dbConnection = new DBConnection()
  }

  async query(query, queryData = []) {
    try {
      const connection = await this.dbConnection.createConnection()
      try {
        const { rows } = await connection.query(query, queryData)
        await this.dbConnection.closeConnection(connection)

        return {
          data: rows,
          errors: null
        }
      } catch (error) {
        await this.dbConnection.closeConnection(connection)
        return {
          data: null,
          errors: { ...error, msg: error.stack.split('\n') }
        }
      }
    } catch (err) {
      return {
        data: null,
        errors: err
      }
    }
  }

  async one(query, queryData = []) {
    const result = await this.query(query, queryData)
    if (result.data && result.data.length > 0) {
      result.data = result.data[0]
    } else {
      result.data = null
    }
    return result
  }

  async transaction(query, queryData, callbackPromise) {
    try {
      const poolConnection = await this.dbConnection.createConnection()
      const connection = await poolConnection.getConnection()
      try {
        await connection.beginTransaction()

        let result = await connection.query(query, queryData)
        const isTransactionalEnabled = () => {
          const DEFAULT_VALUE = 'true'
          const isTransactionalEnabled =
            process.env.ELASTIC_TRANSACTIONAL_ENABLED || DEFAULT_VALUE
          return isTransactionalEnabled === 'true'
        }

        if (isTransactionalEnabled()) {
          await callbackPromise()
          await connection.commit()
          return { data: result }
        }

        await connection.release()
        return { data: result }
      } catch (error) {
        await connection.rollback()
        await connection.release()
        return { errors: error }
      }
    } catch (error) {
      return { errors: error.message }
    }
  }
}

module.exports = DBService
