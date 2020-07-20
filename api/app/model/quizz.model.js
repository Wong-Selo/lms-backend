const DBConnection = require('@utils/database')
const Query = require('@utils/query')
const NOW = new Date()
const UUID = require('uuid').v4()

class QuizzModel {
  constructor() {
    this.dbConnection = new DBConnection()
    this.query = new Query()
    this.table = 'quizzes'
  }

  async createQuizz(data) {
    const dataObj = {
      ...data,
      quiz_uuid: UUID,
      created_at: NOW.toISOString(),
      updated_at: NOW.toISOString()
    }
    const query = this.query.makeInsertQuery(this.table, dataObj)
    let result = await this.dbConnection.query(query)

    result = {
      ...result,
      insertId: UUID
    }

    return result
  }
}

module.exports = QuizzModel
