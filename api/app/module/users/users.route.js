"use strict";

const UserController = require("./users.controller");

module.exports = (app) => {
  const userController = new UserController();

  app.route("/users/list").get(userController.getAllUser);
  app.route("/users/detail/:id").get(userController.getDetailUser);
  app.route("/users/create").post(userController.createUser);
  app.route("/users/delete/:id").delete(userController.deleteUser);
};
