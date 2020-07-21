const DBConnection = require('@utils/database')
const Query = require('@utils/query')
const NOW = new Date()

class QustionModel {
  constructor() {
    this.dbConnection = new DBConnection()
    this.query = new Query()
    this.table = 'question_choices'
  }

  async createChoices(data) {
    const dataObj = []

    for (const choiceData of data) {
      const { question_uuid, choices } = choiceData
      for (const choice of choices) {
        dataObj.push({
          question_choice_uuid: require('uuid').v4(),
          question_uuid,
          content: choice,
          created_at: NOW.toISOString(),
          updated_at: NOW.toISOString()
        })
      }
    }

    const query = await this.query.makeMultipleInsertQuery(this.table, dataObj)

    const result = await this.dbConnection.query(query)

    return result
  }

  async getChoicesByQuestionId(questionId) {
    const query = `SELECT * FROM ${this.table} WHERE question_uuid = $1`
    const result = await this.dbConnection.query(query, [questionId])

    return result
  }
}

module.exports = QustionModel
