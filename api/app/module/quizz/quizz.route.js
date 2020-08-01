'use strict'

const QuizzController = require('./quizz.controller')

module.exports = (app) => {
  const quizzController = new QuizzController()

  app.route('/quizzes/list').get(quizzController.getQuizzes)
  app.route('/quizzes/detail/:id').get(quizzController.getQuiz)
  app.route('/quizzes/create').post(quizzController.createQuizz)
  app.route('/quizzes/delete/:id').delete(quizzController.deleteQuiz)
}
