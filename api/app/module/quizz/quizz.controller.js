'use strict'

const validator = require('@utils/validator')
const UserModel = require('@model/user.model')
const GroupModel = require('@model/group.model')
const GroupMemberModel = require('@model/group.member.model')
const QuizzModel = require('@model/quizz.model')
const ObjectManipulation = require('@utils/object.manipulation')

class QuizzController {
  constructor() {
    this.quizzModel = new QuizzModel()
    this.userModel = new UserModel()
    this.groupModel = new GroupModel()
    this.groupMemberModel = new GroupMemberModel()
    this.objectManipulation = new ObjectManipulation()

    this.createQuizz = this.createQuizz.bind(this)
  }

  async _userHasMember(req, res, groupId, userId) {
    let { user_uuid } = req.user
    user_uuid = userId ? userId : user_uuid

    const { errors, data } = await this.groupMemberModel.userHasJoin(
      user_uuid,
      groupId
    )

    if (errors) return res.sendError(errors)

    if (!data)
      return res.sendError(
        {
          user_uuid: req.strings.errors.group.not_member.replace(
            '$_variable',
            user_uuid
          )
        },
        req.strings.errors.group.not_member.replace('$_variable', user_uuid)
      )
  }

  async createQuizz(req, res) {
    const { user_uuid } = req.user
    let {
      group_uuid,
      name: quizz_name,
      description: quiz_description,
      duration,
      is_private
    } = req.body

    const requires = ['name', 'description', 'duration', 'is_private']
    let errors = validator.checkBody(req.body, requires, req.strings)
    if (errors) return res.sendError(errors)

    if (group_uuid) {
      is_private = 1

      const {
        data: groupExist,
        errors: getGroupError
      } = await this.groupModel.getGroupById(group_uuid)
      if (getGroupError) return res.sendError(getGroupError)

      if (!groupExist)
        return res.sendError(
          {
            name: req.strings.errors.group.group_doesnt_exist.replace(
              '$_variable',
              group_uuid
            )
          },
          req.strings.errors.group.group_doesnt_exist.replace(
            '$_variable',
            group_uuid
          )
        )

      await this._userHasMember(groupId, null)
    }

    const dataToInsert = {
      group_uuid,
      user_uuid,
      quizz_name,
      quiz_description,
      duration,
      is_private
    }

    const {
      insertId,
      data,
      errors: insertError
    } = await this.quizzModel.createQuizz(dataToInsert)
    if (insertError) return res.sendError(insertError)

    return res.sendSuccess({ ...insertId, ...data })
  }
}

module.exports = QuizzController
