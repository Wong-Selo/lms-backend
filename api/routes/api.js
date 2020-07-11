const userRoute = require('@module/users/users.route')
const authRoute = require('@module/auth/auth.route')

module.exports = (app) => {
  userRoute(app)
  authRoute(app)
}