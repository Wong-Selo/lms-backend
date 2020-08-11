'use strict'

const QuestionController = require('./question.controller')

module.exports = (app) => {
  const questionController = new QuestionController()

  app.route('/questions/create').post(questionController.createQuestion)
  app.route('/questions/detail/:id').get(questionController.getQuestion)
  app.route('/questions/delete/:id').delete(questionController.deleteQuestion)
}
