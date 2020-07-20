const authRoute = require('@module/auth/auth.route')
const userRoute = require('@module/user/user.route')
const profileRoute = require('@module/profile/profile.route')
const groupRoute = require('@module/group/group.route')
const quizzRoute = require('@module/quizz/quizz.route')

const authMiddleware = require('@middleware/authentication')

module.exports = (app) => {
  authRoute(app)

  // implement auth middleware
  app.use(authMiddleware)

  userRoute(app)
  profileRoute(app)
  groupRoute(app)
  quizzRoute(app)
}
