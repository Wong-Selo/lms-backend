const DBConnection = require("@utils/database");
const NOW = new Date()
const UUID = require('uuid').v4()

class UserModel {
  constructor() {
    this.dbConnection = new DBConnection();
    this.table = "users";
  }

  async getUsers(search, limit, offset) {
    const condition = search? `AND name ILIKE '%${search}%'` : ''
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

    const columnToInsert = [
      'user_uuid', 'name', 'email', 'password', 'created_at', 'updated_at'
    ]

    const dataToInsert = [
      UUID,
      data.name,
      data.email,
      data.password,
      NOW,
      NOW
    ]

    const query = `INSERT INTO ${this.table}(${columnToInsert}) VALUES ($1, $2, $3, $4, $5, $6)`
    const result = await this.dbConnection.query(query, dataToInsert)
    
    return result
  }

  async deleteUser(userId) {
    const query = `UPDATE ${this.table} SET deleted_at = $1 WHERE user_uuid = $2`
    const result = await this.dbConnection.query(query, [NOW, userId])

    return result
  }
}

module.exports = UserModel;
