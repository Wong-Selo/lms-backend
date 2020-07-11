"use strict";

const UserController = require('./users.controller')

module.exports = (app) => {
  const userController = new UserController()

  app
    .route('/users/list')
    .get(userController.getAllUser)
}