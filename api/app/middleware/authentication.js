const jwt = require("jsonwebtoken");
const UserModel = require("../../app/model/user.model");
const userModel = new UserModel();
const { API_JWT_KEY } = process.env;

module.exports = async (req, res, next) => {
  let { token } = req.headers;
  if (!token)
    return res.sendError(
      {
        token: req.strings.errors.auth.unauthorized,
      },
      req.strings.errors.auth.unauthorized,
      401
    );

  token = token.trim();
  try {
    let decoded = jwt.verify(token, API_JWT_KEY);
    const { data } = await userModel.getUserByEmail(decoded.email);

    if (!data)
      return res.sendError(
        {
          token: req.strings.errors.auth.unauthorized,
        },
        req.strings.errors.auth.unauthorized,
        401
      );

    if (!data.is_active)
      return res.sendError(req.strings.errors.auth.in_active, 401);

    if (data.deleted_at)
      return res.sendError(req.strings.errors.auth.suspended, 401);

    req.user = { ...decoded, is_superuser: data.is_superuser };
    return next();
  } catch (err) {
    return res.sendError(err, req.strings.errors.auth.unauthorized, 401);
  }
};
