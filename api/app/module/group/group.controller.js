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

    this._groupIsFull = this._groupIsFull.bind(this)
    this._canModifyGroup = this._canModifyGroup.bind(this)
    this._generateGroupCode = this._generateGroupCode.bind(this)
    this.createGroup = this.createGroup.bind(this)
    this.addMember = this.addMember.bind(this)
    this.removeMember = this.removeMember.bind(this)
    this.editGroup = this.editGroup.bind(this)
  }

  async _groupIsFull(groupId) {
    const {
      data: groupMemberData
    } = await this.groupMemberModel.getMemberByGroup(groupId)
    const { data: groupData } = await this.groupModel.getGroupById(groupId)

    const currentTotalMember = groupMemberData.length
    const maxMember = groupData ? groupData.max_member : 0

    if (currentTotalMember >= maxMember) return true

    return false
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

    /**
     * Validate group not full
     */

    if (await this._groupIsFull(group_uuid))
      return res.sendError(req.strings.errors.group.group_full)

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

  async removeMember(req, res) {
    const { user_uuid: currentUserId } = req.user
    const { user_uuid, group_uuid } = req.body

    const requires = ['user_uuid', 'group_uuid']
    let errors = validator.checkBody(req.body, requires, req.strings)
    if (errors) return res.sendError(errors)

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

    if (!hasMember)
      return res.sendError(
        {
          user_uuid: req.strings.errors.group.not_member.replace(
            '$_variable',
            user_uuid
          )
        },
        req.strings.errors.group.not_member.replace('$_variable', user_uuid)
      )

    if (!(await this._canModifyGroup(currentUserId, group_uuid)))
      return res.sendError(req.strings.errors.group.dont_have_permission)

    const {
      data: removeMemberData,
      errors: removeMemberError
    } = await this.groupMemberModel.removeMember(user_uuid, group_uuid)
    if (removeMemberError) return res.sendError(removeMemberError)

    return res.sendSuccess(removeMemberData)
  }

  async editGroup(req, res) {
    const { user_uuid: currentUserId } = req.user
    const { id: groupId } = req.params
    const {
      name: group_name,
      description: group_description,
      max_member
    } = req.body

    const {
      data: groupExist,
      errors: groupExistError
    } = await this.groupModel.getGroupById(groupId)

    if (groupExistError) return res.sendError(groupExistError)

    if (!groupExist)
      return res.sendError(
        {
          group_uuid: req.strings.errors.group.group_doesnt_exist.replace(
            '$groupId',
            groupId
          )
        },
        req.strings.errors.group.group_doesnt_exist.replace(
          '$_variable',
          groupId
        )
      )

    if (!(await this._canModifyGroup(currentUserId, groupId)))
      return res.sendError(req.strings.errors.group.dont_have_permission)

    /**
     * Validate max member can't lower than current total member
     */
    const { data: memberData } = await this.groupMemberModel.getMemberByGroup(
      groupId
    )
    const currentMaxMember = memberData ? memberData.length : 0

    if (max_member && parseInt(max_member) < parseInt(currentMaxMember))
      return res.sendError(
        {
          name: req.strings.errors.group.decrease_max_member
            .replace('$_current_max', currentMaxMember)
            .replace('$_max_member', max_member)
        },
        req.strings.errors.group.decrease_max_member
          .replace('$_current_max', currentMaxMember)
          .replace('$_max_member', max_member)
      )

    const {
      data: groupNameExist,
      errors: groupNameExistError
    } = await this.groupModel.getGroupByNameAndUser(
      group_name,
      groupExist.user_uuid
    )
    if (group_name && groupNameExistError)
      return res.sendError(groupNameExistError)

    if (group_name && group_name !== groupExist.group_name && groupNameExist)
      return res.sendError(
        {
          name: req.strings.errors.group.group_exist.replace(
            '$_variable',
            group_name
          )
        },
        req.strings.errors.group.group_exist.replace('$_variable', group_name)
      )

    const dataToUpdate = {
      group_description: group_description || groupExist.group_description,
      group_name: group_name || groupExist.group_name,
      max_member: max_member || groupExist.max_member
    }

    const { errors: updateError } = await this.groupModel.updateGroup(
      dataToUpdate,
      groupId
    )
    if (updateError) return res.sendError(updateError)

    return res.sendSuccess()
  }
}

module.exports = GroupController
