const DBConnection = require('@utils/database')
const Query = require('@utils/query')
const NOW = new Date()
const UUID = require('uuid').v4()

class ProfileModel {
  constructor() {
    this.dbConnection = new DBConnection()
    this.query = new Query()
    this.table = 'profiles'
  }

  async getProfile(userId) {
    const query = `SELECT p.*, u.name, u.email FROM ${this.table} p 
      JOIN users u ON u.user_uuid = p.user_uuid  WHERE p.user_uuid = $1 AND u.deleted_at IS NULL`
    const result = await this.dbConnection.one(query, [userId])

    return result
  }

  async createProfile(data) {
    const dataObject = {
      profile_uuid: UUID,
      user_uuid: data.user_uuid,
      birth_date: data.birth_date,
      phone: data.phone,
      website: data.website,
      bio: data.bio,
      instagram: data.instagram,
      facebook: data.facebook,
      twitter: data.twitter,
      created_at: NOW.toISOString(),
      updated_at: NOW.toISOString()
    }

    const query = this.query.makeInsertQuery(this.table, dataObject)
    const result = await this.dbConnection.query(query)

    return result
  }

  async updateByUserId(userId, data) {
    let updateCondition = [
      { column: 'user_uuid', operator: '=', value: userId }
    ]
    let query = this.query.makeUpdateQuery(this.table, data, updateCondition)
    console.log(query)

    const result = await this.dbConnection.query(query)
    return result
  }
}

module.exports = ProfileModel
