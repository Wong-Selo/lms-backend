"use strict";

const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(11);
const UserModel = require("@model/user.model");
const validator = require("@utils/validator");
const jwt = require("jsonwebtoken");
const { API_JWT_KEY, API_JWT_EXPIRE, URL_CHANGE_PASSWORD } = process.env;

class AuthController {
  constructor() {
    this.signIn = this.signIn.bind(this);
    this.signUp = this.signUp.bind(this);

    this.userModel = new UserModel();
  }

  async signIn(req, res) {
    const { email, password } = req.body;
    const requires = ["email", "password"];
    let errors = validator.checkBody(req.body, requires, req.strings);
    if (errors) return res.sendError(errors);

    const {
      data: userData,
      errors: userError,
    } = await this.userModel.getUserByEmail(email);
    if (userError) return res.sendError(userError);

    if (!userData)
      return res.sendError(
        {
          email: req.strings.errors.user.not_found,
        },
        req.strings.errors.user.not_found
      );

    if (!bcrypt.compareSync(password, userData.password))
      return res.sendError(
        {
          password: req.strings.errors.credential.not_match,
        },
        req.strings.errors.credential.not_match
      );
    
    if (!userData.is_active)
      return res.sendError(
        {
          password: req.strings.errors.user.inactive,
        },
        req.strings.errors.user.inactive
      );

    const token = jwt.sign(
      {
        user_uuid: userData.user_uuid,
        email: userData.email,
        is_active: userData.is_active,
      },
      API_JWT_KEY
    );

    return res.sendSuccess(
      {
        token: token,
      },
      req.strings.success.login
    );
  }

  async signUp(req, res) {
    const { email, name, password, confirm_password } = req.body;
    const requires = ["email", "name", "password", "confirm_password"];
    let errors = validator.checkBody(req.body, requires, req.strings);
    if (errors) return res.sendError(errors);

    if (password !== confirm_password) return res.sendError();

    const {
      data: dataUser,
      errors: userError,
    } = await this.userModel.getUserByEmail(email);
    if (userError) return res.sendError(userError);

    if (dataUser)
      return res.sendError(
        {
          email: req.strings.errors.user.email_exist,
        },
        req.strings.errors.user.email_exist
      );

    const dataToInsert = {
      name,
      email,
      password: bcrypt.hashSync(password, salt),
    };

    const {
      data: dataCreate,
      errors: errorCreate,
    } = await this.userModel.createUser(dataToInsert);
    if (errorCreate) return res.sendError(errorCreate);

    return res.sendSuccess(dataCreate);
  }
}

module.exports = AuthController;
