const DBConnection = require('@utils/database')
const Query = require('@utils/query')
const NOW = new Date()
const UUID = require('uuid').v4()

class GroupModel {
  constructor() {
    this.dbConnection = new DBConnection()
    this.query = new Query()
    this.table = 'groups'
  }

  async getGroupByUser(userId) {
    const query = `SELECT * FROM ${this.table} WHERE user_uuid = $1`
    const result = await this.dbConnection.query(query, [userId])

    return result
  }

  async createGroup(data) {
    const dataObject = {
      ...data,
      group_uuid: UUID,
      created_at: NOW.toISOString(),
      updated_at: NOW.toISOString()
    }

    const query = this.query.makeInsertQuery(this.table, dataObject)
    const result = await this.dbConnection.query(query)
    result.insertId = UUID
    return result
  }

  async getGroupById(groupId) {
    const query = `SELECT * FROM ${this.table} WHERE group_uuid = $1`
    const result = await this.dbConnection.one(query, [groupId])

    return result
  }

  async getGroupByNameAndUser(groupName, userId) {
    const query = `SELECT * FROM ${this.table} WHERE group_name = $1 AND user_uuid = $2`
    const result = await this.dbConnection.one(query, [groupName, userId])

    return result
  }

  async getGroupByIdAndUser(groupId, userId) {
    const query = `SELECT * FROM ${this.table} WHERE group_uuid = $1 AND user_uuid = $2`
    const result = await this.dbConnection.one(query, [groupId, userId])

    return result
  }
}

module.exports = GroupModel
