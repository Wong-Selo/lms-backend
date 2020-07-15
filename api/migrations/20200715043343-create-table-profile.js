'use strict'

var dbm
var type
var seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

exports.up = function (db, callback) {
  return db.createTable(
    'profiles',
    {
      profile_uuid: {
        type: 'string',
        primaryKey: true,
        length: 36
      },
      user_uuid: {
        type: 'string',
        length: 36,
        foreignKey: {
          name: 'profile_user_uuid_fk',
          table: 'users',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          },
          mapping: 'user_uuid',
          notNull: true
        }
      },
      birth_date: { type: 'date', notNull: false },
      bio: { type: 'text', notNull: false },
      phone: { type: 'string', notNull: false },
      website: { type: 'string', notNull: false },
      facebook: { type: 'string', notNull: false },
      twitter: { type: 'string', notNull: false },
      instagram: { type: 'string', notNull: false },
      created_at: {
        type: 'timestamp',
        notNull: false
      },
      updated_at: {
        type: 'timestamp',
        notNull: false
      },
      deleted_at: {
        type: 'timestamp',
        notNull: false
      }
    },
    callback
  )
}

exports.down = function (db, callback) {
  return db.dropTable('profiles', callback)
}

exports._meta = {
  version: 1
}
