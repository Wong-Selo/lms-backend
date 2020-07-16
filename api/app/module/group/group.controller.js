'use strict'

const validator = require('@utils/validator')
const UserModel = require('@model/user.model')
const GroupModel = require('@model/group.model')
const GroupMemberModel = require('@model/group.member.model')
const UUID = require('uuid').v4()

class GroupController {
  constructor() {
    this.userModel = new UserModel()
    this.groupModel = new GroupModel()
    this.groupMemberModel = new GroupMemberModel()

    this._canModifyGroup = this._canModifyGroup.bind(this)
    this._generateGroupCode = this._generateGroupCode.bind(this)
    this.createGroup = this.createGroup.bind(this)
    this.addMember = this.addMember.bind(this)
  }

  async _canModifyGroup(userId, groupId) {
    if (!userId || !groupId) return false

    const { data: groupData } = await this.groupModel.getGroupByIdAndUser(
      groupId,
      userId
    )
    const { data: groupMemberData } = await this.groupMemberModel.userHasAdmin(
      userId,
      groupId
    )

    if (groupData || groupMemberData) return true

    return false
  }

  _generateGroupCode(groupName) {
    let uuidCode = UUID.split('-').slice(-1).pop()
    let groupNameCode = groupName.split(' ')
    groupNameCode = groupNameCode.length
      ? `${groupNameCode[0][0]}${groupNameCode[1][0]}`
      : `${groupNameCode[0][0]}${groupNameCode[0][1]}`

    return groupNameCode + uuidCode
  }

  async createGroup(req, res) {
    const { user_uuid } = req.user
    const {
      name: group_name,
      description: group_description,
      max_member
    } = req.body

    const requires = ['name', 'description']
    let errors = validator.checkBody(req.body, requires, req.strings)
    if (errors) return res.sendError(errors)

    const {
      data: groupExist,
      errors: groupExistError
    } = await this.groupModel.getGroupByNameAndUser(group_name, user_uuid)
    if (groupExistError) return res.sendError(groupExistError)

    if (groupExist)
      return res.sendError(
        {
          name: req.strings.errors.group.group_exist.replace(
            '$_variable',
            group_name
          )
        },
        req.strings.errors.group.group_exist.replace('$_variable', group_name)
      )

    const dataToInsert = {
      user_uuid,
      group_name,
      group_description,
      max_member: max_member ? max_member : 10,
      group_code: this._generateGroupCode(group_name)
    }

    const { errors: createError, insertId } = await this.groupModel.createGroup(
      dataToInsert
    )
    if (createError) return res.sendError(createError)

    const {
      errors: joinGroupError
    } = await this.groupMemberModel.createGroupMember({
      user_uuid,
      group_uuid: insertId,
      is_admin: 1
    })
    if (joinGroupError) return res.sendError(joinGroupError)

    return res.sendSuccess()
  }

  async addMember(req, res) {
    const { user_uuid: reqUserId } = req.user
    const { user_uuid, group_uuid } = req.body

    const requires = ['user_uuid', 'group_uuid']
    let errors = validator.checkBody(req.body, requires, req.strings)
    if (errors) return res.sendError(errors)

    const {
      data: hasUser,
      errors: hasUserError
    } = await this.userModel.getUserById(user_uuid)
    if (hasUserError) return res.sendError(hasUserError)

    if (!hasUser)
      return res.sendError(
        {
          name: req.strings.errors.user.not_found
        },
        req.strings.errors.user.not_found
      )

    const {
      data: hasGroup,
      errors: hasGroupError
    } = await this.groupModel.getGroupById(group_uuid)
    if (hasGroupError) return res.sendError(hasGroupError)

    if (!hasGroup)
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

    const {
      data: hasMember,
      erorrs: hasMemberError
    } = await this.groupMemberModel.userHasJoin(user_uuid, group_uuid)
    if (hasMemberError) return res.sendError(hasMemberError)

    if (hasMember)
      return res.sendError(
        {
          user_uuid: req.strings.errors.group.already_joined.replace(
            '$_variable',
            user_uuid
          )
        },
        req.strings.errors.group.already_joined.replace('$_variable', user_uuid)
      )

    /**
     * Validate non admin/owner can't add member
     */
    if (!(await this._canModifyGroup(reqUserId, group_uuid)))
      return res.sendError(req.strings.errors.group.dont_have_permission)

    const dataToInsert = {
      user_uuid,
      group_uuid
    }

    const {
      erorrs: insertError
    } = await this.groupMemberModel.createGroupMember(dataToInsert)
    if (insertError) return res.sendError(insertError)

    return res.sendSuccess()
  }
}

module.exports = GroupController
