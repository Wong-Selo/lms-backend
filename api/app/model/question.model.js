const DBConnection = require('@utils/database')
const Query = require('@utils/query')
const NOW = new Date()
const UUID = require('uuid').v4()

class QustionModel {
  constructor() {
    this.dbConnection = new DBConnection()
    this.query = new Query()
    this.table = 'questions'
  }

  async createQuestion(data) {
    const dataObj = {
      ...data,
      question_uuid: UUID,
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

  async createQuestions(data) {
    const dataObj = []
    for (const question of data) {
      dataObj.push({
        question_uuid: question.question_uuid,
        quiz_uuid: question.quiz_uuid,
        type: question.type,
        answer: question.answer,
        content: question.content,
        created_at: NOW.toISOString(),
        updated_at: NOW.toISOString()
      })
    }

    const query = await this.query.makeMultipleInsertQuery(this.table, dataObj)

    const result = await this.dbConnection.query(query)
    return result
  }

  async getQuestionByQuizId(quizId) {
    const query = `SELECT * FROM ${this.table} WHERE quiz_uuid = $1`
    const result = await this.dbConnection.query(query, [quizId])

    return result
  }
}

module.exports = QustionModel
