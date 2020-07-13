"use strict";

const UserController = require("./users.controller");

module.exports = (app) => {
  const userController = new UserController();

  app.route("/users/list").get(userController.getAllUser);
  app.route("/users/detail/:id").get(userController.getDetailUser);
  app.route("/users/create").post(userController.createUser);
  app.route("/users/delete/:id").delete(userController.deleteUser);
  app.route("/users/update/:id").put(userController.updateById);
  app.route("/users/profile").get(userController.getProfile);
  app.route("/users/profile").put(userController.updateLoggedUser);
};
