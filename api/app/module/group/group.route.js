'use strict'

const GroupController = require('./group.controller')

module.exports = (app) => {
  const groupController = new GroupController()

  app.route('/groups/create').post(groupController.createGroup)
  app.route('/groups/edit/:id').put(groupController.editGroup)
  app.route('/groups/member/add').post(groupController.addMember)
  app.route('/groups/member/delete').delete(groupController.removeMember)
}
