'use strict'

const ProfileController = require('./profile.controller')

module.exports = (app) => {
  const profileController = new ProfileController()

  app.route('/profiles/update').put(profileController.updateProfile)
  app.route('/profiles').get(profileController.getProfile)
}
