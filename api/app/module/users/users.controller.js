"use strict";
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(11);
const UserModel = require("@model/user.model");
const ObjectManipulation = require("@utils/object.manipulation");

class UserController {
  constructor() {
    this.getAllUser = this.getAllUser.bind(this);
    this.createUser = this.createUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.getDetailUser = this.getDetailUser.bind(this);

    this.userModel = new UserModel();
    this.objectManipulation = new ObjectManipulation();
  }

  async getAllUser(req, res) {
    const { q: search, limit, offset } = req.query;

    const { data, errors } = await this.userModel.getUsers(
      search,
      limit,
      offset
    );

    if (errors) return res.sendError(errors);

    data.map((item) =>
      this.objectManipulation.deleteKey(item, [
        "password",
        "is_superuser",
        "deleted_at",
      ])
    );
    return res.sendSuccess(data);
  }

  async getDetailUser(req, res) {
    const { id: userId } = req.params;

    const { data, errors } = await this.userModel.getUserById(userId);
    if (errors) return res.sendError(errors);

    if (!data)
      return res.sendError(
        {
          user_uuid: req.strings.errors.user.not_found,
        },
        req.strings.errors.user.not_found,
        404
      );

    this.objectManipulation.deleteKey(data, [
      "password",
      "is_superuser",
      "deleted_at",
    ]);
    return res.sendSuccess(data);
  }

  async createUser(req, res) {
    let { name, email, password } = req.body;
    password = bcrypt.hashSync(password, salt);

    const { data, errors } = await this.userModel.createUser({
      name,
      email,
      password,
    });

    if (errors) return res.sendError(errors);

    return res.sendSuccess(data);
  }

  async deleteUser(req, res) {
    const { id: userId } = req.params;

    const { data, errors } = await this.userModel.getUserById(userId);
    if (errors) return res.sendError(errors);

    if (!data)
      return res.sendError(
        {
          user_uuid: req.strings.errors.user.not_found,
        },
        req.strings.errors.user.not_found,
        404
      );

    const {
      data: deleteUser,
      errors: deleteError,
    } = await this.userModel.deleteUser(userId);
    if (deleteError) res.sendError(deleteError);

    return res.sendSuccess(deleteUser);
  }
}

module.exports = UserController;
