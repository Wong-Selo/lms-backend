'use strict'

const QuizzController = require('./quizz.controller')

module.exports = (app) => {
  const quizzController = new QuizzController()

  app.route('/quizzes/create').post(quizzController.createQuizz)
}
