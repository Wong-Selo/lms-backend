const DBConnection = require('@utils/database')
const Query = require('@utils/query')
const NOW = new Date()
const UUID = require('uuid').v4()

class GroupMemberModel {
  constructor() {
    this.dbConnection = new DBConnection()
    this.query = new Query()
    this.table = 'group_members'
  }

  async createGroupMember(data) {
    const dataObject = {
      ...data,
      group_member_uuid: UUID,
      created_at: NOW.toISOString(),
      updated_at: NOW.toISOString()
    }

    const query = this.query.makeInsertQuery(this.table, dataObject)
    const result = await this.dbConnection.query(query)

    return result
  }

  async userHasJoin(userId, groupId) {
    const query = `SELECT * FROM ${this.table} WHERE user_uuid = $1 AND group_uuid = $2`
    const result = await this.dbConnection.one(query, [userId, groupId])

    return result
  }
}

module.exports = GroupMemberModel
