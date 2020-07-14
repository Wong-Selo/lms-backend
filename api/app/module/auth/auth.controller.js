'use strict'

const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(11)
const UserModel = require('@model/user.model')
const validator = require('@utils/validator')
const jwt = require('jsonwebtoken')
const { API_JWT_KEY, API_JWT_EXPIRE, URL_CHANGE_PASSWORD } = process.env
const SendEmail = require('@utils/email/send.email')

class AuthController {
  constructor() {
    this.signIn = this.signIn.bind(this)
    this.signUp = this.signUp.bind(this)
    this.verifyEmail = this.verifyEmail.bind(this)

    this.userModel = new UserModel()
    this.sendEmail = new SendEmail()
  }

  async signIn(req, res) {
    const { email, password } = req.body
    const requires = ['email', 'password']
    let errors = validator.checkBody(req.body, requires, req.strings)
    if (errors) return res.sendError(errors)

    const {
      data: userData,
      errors: userError
    } = await this.userModel.getUserByEmail(email)
    if (userError) return res.sendError(userError)

    if (!userData)
      return res.sendError(
        {
          email: req.strings.errors.user.not_found
        },
        req.strings.errors.user.not_found
      )

    if (!bcrypt.compareSync(password, userData.password))
      return res.sendError(
        {
          password: req.strings.errors.credential.not_match
        },
        req.strings.errors.credential.not_match
      )

    if (!userData.is_active)
      return res.sendError(
        {
          password: req.strings.errors.user.inactive
        },
        req.strings.errors.user.inactive
      )

    const token = jwt.sign(
      {
        user_uuid: userData.user_uuid,
        email: userData.email,
        is_active: userData.is_active
      },
      API_JWT_KEY
    )

    return res.sendSuccess(
      {
        token: token
      },
      req.strings.success.login
    )
  }

  async signUp(req, res) {
    const { email, name, password, confirm_password } = req.body
    const requires = ['email', 'name', 'password', 'confirm_password']
    let errors = validator.checkBody(req.body, requires, req.strings)
    if (errors) return res.sendError(errors)

    if (password !== confirm_password) return res.sendError()

    const {
      data: dataUser,
      errors: userError
    } = await this.userModel.getUserByEmail(email)
    if (userError) return res.sendError(userError)

    if (dataUser)
      return res.sendError(
        {
          email: req.strings.errors.user.email_exist
        },
        req.strings.errors.user.email_exist
      )

    const dataToInsert = {
      name,
      email,
      password: bcrypt.hashSync(password, salt)
    }

    const {
      data: dataCreate,
      errors: errorCreate
    } = await this.userModel.createUser(dataToInsert)
    if (errorCreate) return res.sendError(errorCreate)

    // sending email to verification
    const { success, error } = this.sendEmail.sendEmailVerify({ name, email })

    if (error) return res.sendError(error)

    return res.sendSuccess(success)
  }

  async verifyEmail(req, res) {
    const { token } = req.query
    if (!token)
      return res.sendError({
        token: req.strings.errors.required.replace('$_variable', 'token')
      })

    try {
      const { email } = jwt.verify(token, API_JWT_KEY)
      if (!email) {
        return res.sendError(
          {
            token: req.strings.errors.token.invalid
          },
          req.strings.errors.token.invalid
        )
      }

      const { data, errors } = await this.userModel.getUserByEmail(email)
      if (errors) return res.sendError(errors)

      if (!data)
        return res.sendError(
          {
            email: req.strings.errors.user.not_found
          },
          req.strings.errors.user.not_found
        )

      // set user to active
      const { errors: updateError } = await this.userModel.setActiveUser(
        email,
        1
      )
      if (updateError) return res.sendError(updateError)

      return res.sendSuccess(req.strings.success.email_verified)
    } catch (err) {
      return res.sendError(
        {
          token: req.strings.errors.token.invalid
        },
        req.strings.errors.token.invalid
      )
    }
  }
}

module.exports = AuthController
