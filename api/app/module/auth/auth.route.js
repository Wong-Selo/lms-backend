'use strict'

const AuthController = require('./auth.controller')

module.exports = (app) => {
  const authController = new AuthController()

  app.route('/auth/sign-in').post(authController.signIn)
  app.route('/auth/sign-up').post(authController.signUp)
  app.route('/auth/verify').get(authController.verifyEmail)
}
