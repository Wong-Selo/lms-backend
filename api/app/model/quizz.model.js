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

  async getByQuizId(quizId) {
    const query = `SELECT * FROM ${this.table} WHERE quiz_uuid = $1`
    const result = await this.dbConnection.one(query, [quizId])

    return result
  }

  async getByUserId(userId) {
    const query = `SELECT * FROM ${this.table} WHERE user_uuid = $1`
    const result = await this.dbConnection.query(query, [userId])

    return result
  }

  async getByGroupId(quizId) {
    const query = `SELECT * FROM ${this.table} WHERE group_uuid = $1`
    const result = await this.dbConnection.query(query, [quizId])

    return result
  }
}

module.exports = QuizzModel
