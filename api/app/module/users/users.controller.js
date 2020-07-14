'use strict'
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(11)
const validator = require('@utils/validator')
const UserModel = require('@model/user.model')
const ObjectManipulation = require('@utils/object.manipulation')

class UserController {
  constructor() {
    this.getAllUser = this.getAllUser.bind(this)
    this.createUser = this.createUser.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
    this.getDetailUser = this.getDetailUser.bind(this)
    this.updateById = this.updateById.bind(this)
    this.getProfile = this.getProfile.bind(this)
    this.updateLoggedUser = this.updateLoggedUser.bind(this)

    this.userModel = new UserModel()
    this.objectManipulation = new ObjectManipulation()
  }

  async getAllUser(req, res) {
    const { q: search, limit, offset } = req.query

    const { data, errors } = await this.userModel.getUsers(
      search,
      limit,
      offset
    )

    if (errors) return res.sendError(errors)

    data.map((item) =>
      this.objectManipulation.deleteKey(item, [
        'password',
        'is_superuser',
        'deleted_at'
      ])
    )
    return res.sendSuccess(data)
  }

  async getDetailUser(req, res) {
    const { id: userId } = req.params

    const { data, errors } = await this.userModel.getUserById(userId)
    if (errors) return res.sendError(errors)

    if (!data)
      return res.sendError(
        {
          user_uuid: req.strings.errors.user.not_found
        },
        req.strings.errors.user.not_found,
        404
      )

    this.objectManipulation.deleteKey(data, [
      'password',
      'is_superuser',
      'deleted_at'
    ])
    return res.sendSuccess(data)
  }

  async createUser(req, res) {
    let { name, email, password } = req.body
    password = bcrypt.hashSync(password, salt)

    const { data, errors } = await this.userModel.createUser({
      name,
      email,
      password
    })

    if (errors) return res.sendError(errors)

    return res.sendSuccess(data)
  }

  async deleteUser(req, res) {
    const { id: userId } = req.params

    const { data, errors } = await this.userModel.getUserById(userId)
    if (errors) return res.sendError(errors)

    if (!data)
      return res.sendError(
        {
          user_uuid: req.strings.errors.user.not_found
        },
        req.strings.errors.user.not_found,
        404
      )

    const {
      data: deleteUser,
      errors: deleteError
    } = await this.userModel.deleteUser(userId)
    if (deleteError) res.sendError(deleteError)

    return res.sendSuccess(deleteUser)
  }

  async updateById(req, res) {
    const { id: userId } = req.params
    let { name, email, password, is_active } = req.body

    const requires = ['name']
    let errors = validator.checkBody(req.body, requires, req.strings)
    if (errors) return res.sendError(errors)

    const {
      data: userExist,
      errors: userError
    } = await this.userModel.getUserById(userId)
    if (userError) return res.sendError(userError)

    if (!userExist)
      return res.sendError(
        {
          user_uuid: req.strings.errors.user.not_found
        },
        req.strings.errors.user.not_found,
        404
      )

    if (email) {
      const {
        data: dataEmail,
        errors: errorGetEmail
      } = await this.userModel.getUserByEmail(email)
      if (errorGetEmail) return res.sendError(errorGetEmail)

      if (dataEmail)
        return res.sendError(
          {
            email: req.strings.errors.user.email_exist
          },
          req.strings.errors.user.email_exist
        )
    }

    if (password) password = bcrypt.hashSync(password, salt)

    const dataToUpdate = {
      name: name || userExist.name,
      email: email || userExist.email,
      password: password || userExist.password,
      is_active: is_active !== undefined ? is_active : userExist.is_active
    }

    const {
      data: updateData,
      errors: updateError
    } = await this.userModel.updateBasicById(userId, dataToUpdate)
    if (updateError) return res.sendError(updateError)

    return res.sendSuccess(updateData)
  }

  async getProfile(req, res) {
    const { user_uuid: userId } = req.user
    const { data: user, erorrs: userError } = await this.userModel.getUserById(
      userId
    )
    if (userError) return res.sendError(userError)

    this.objectManipulation.deleteKey(user, [
      'password',
      'is_superuser',
      'deleted_at'
    ])

    return res.sendSuccess(user)
  }

  async updateLoggedUser(req, res) {
    const { user_uuid: userId } = req.user
    let { name, password } = req.body

    const requires = ['name']
    let errors = validator.checkBody(req.body, requires, req.strings)
    if (errors) return res.sendError(errors)

    const {
      data: userExist,
      errors: userError
    } = await this.userModel.getUserById(userId)
    if (userError) return res.sendError(userError)

    if (!userExist)
      return res.sendError(
        {
          user_uuid: req.strings.errors.user.not_found
        },
        req.strings.errors.user.not_found,
        404
      )

    if (password) password = bcrypt.hashSync(password, salt)

    const dataToUpdate = {
      name: name || userExist.name,
      password: password || userExist.password
    }

    const {
      data: updateData,
      errors: updateError
    } = await this.userModel.updateBasicById(userId, dataToUpdate)
    if (updateError) return res.sendError(updateError)

    return res.sendSuccess(updateData)
  }
}

module.exports = UserController
