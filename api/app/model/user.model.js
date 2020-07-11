const DBConnection = require("@utils/database");
const { off } = require("../utils/logger.internal");

class UserModel {
  constructor() {
    this.dbConnection = new DBConnection();
    this.table = "users";
  }

  async getUsers(search, limit, offset) {
    const condition = search? `AND name LIKE '%${search}%'` : ''
    const limitQuery = limit ? limit : 20
    const offsetQuery = offset ? offset : 0

    const query = `SELECT * FROM ${this.table} WHERE deleted_at IS NULL ORDER BY name ASC LIMIT ${limitQuery} OFFSET ${offsetQuery}`
    const result = await this.dbConnection.query(query)

    return result
  }
}

module.exports = UserModel;
