"use strict";

const UserModel = require('@model/user.model')

class UserController {
  constructor() {
    this.getAllUser = this.getAllUser.bind(this)

    this.userModel = new UserModel()
  }

  async getAllUser(req, res) {
    const { q: search, limit, offset } = req.query

    const data = await this.userModel.getUsers(search, limit, offset)

    return res.sendError(data)
    if (errors) return res.sendError(errors)

    if (data) return res.sendSuccess(data)
  }
}

module.exports = UserController