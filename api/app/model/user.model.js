const DBConnection = require('@utils/database')
const Query = require('@utils/query')
const NOW = new Date()
const UUID = require('uuid').v4()

class UserModel {
  constructor() {
    this.dbConnection = new DBConnection()
    this.query = new Query()
    this.table = 'users'
  }

  async getUsers(search, limit, offset) {
    const condition = search ? `AND name ILIKE '%${search}%'` : ''
    const limitQuery = limit ? limit : 20
    const offsetQuery = offset ? offset : 0

    const query = `SELECT * FROM ${this.table} WHERE deleted_at IS NULL ${condition} ORDER BY name ASC LIMIT ${limitQuery} OFFSET ${offsetQuery}`
    const result = await this.dbConnection.query(query)

    return result
  }

  async getUserById(userId) {
    const query = `SELECT * FROM ${this.table} WHERE user_uuid = $1`
    const result = await this.dbConnection.one(query, [userId])

    return result
  }

  async getUserByEmail(email) {
    const query = `SELECT * FROM ${this.table} WHERE email = $1`
    const result = await this.dbConnection.one(query, [email])

    return result
  }

  async createUser(data) {
    const dataObject = {
      user_uuid: UUID,
      name: data.name,
      email: data.email,
      password: data.password,
      created_at: NOW.toISOString(),
      updated_at: NOW.toISOString()
    }

    const query = this.query.makeInsertQuery(this.table, dataObject)
    const result = await this.dbConnection.query(query)

    return result
  }

  async deleteUser(userId) {
    const query = `UPDATE ${this.table} SET deleted_at = $1 WHERE user_uuid = $2`
    const result = await this.dbConnection.query(query, [NOW, userId])

    return result
  }

  async setActiveUser(email, isActive) {
    const query = `UPDATE ${this.table} SET updated_at = $1, is_active = $2 WHERE email = $3`
    const result = await this.dbConnection.query(query, [NOW, isActive, email])

    return result
  }

  async updateBasicById(userId, data) {
    let updateCondition = [
      { column: 'user_uuid', operator: '=', value: userId }
    ]
    let query = this.query.makeUpdateQuery(this.table, data, updateCondition)

    const result = await this.dbConnection.query(query)
    return result
  }
}

module.exports = UserModel
