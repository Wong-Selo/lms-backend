const userRoute = require("@module/users/users.route");
const authRoute = require("@module/auth/auth.route");

const authMiddleware = require("@middleware/authentication");

module.exports = (app) => {
  authRoute(app);

  // implement auth middleware
  app.use(authMiddleware);

  userRoute(app);
};
