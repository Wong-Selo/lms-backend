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
    'groups',
    {
      group_uuid: {
        type: 'string',
        primaryKey: true,
        length: 36
      },
      user_uuid: {
        type: 'string',
        length: 36,
        foreignKey: {
          name: 'group_user_uuid_fk',
          table: 'users',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          },
          mapping: 'user_uuid',
          notNull: true
        }
      },
      group_name: {
        type: 'string',
        notNull: true
      },
      group_description: {
        type: 'string',
        notNull: false
      },
      group_icon: {
        type: 'string',
        notNull: false
      },
      group_code: {
        type: 'string',
        notNull: true
      },
      max_member: {
        type: 'int',
        notNull: true
      },
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
  return db.dropTable('groups', callback)
}

exports._meta = {
  version: 1
}
