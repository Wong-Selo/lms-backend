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
    'group_members',
    {
      group_member_uuid: {
        type: 'string',
        primaryKey: true,
        length: 36
      },
      group_uuid: {
        type: 'string',
        length: 36,
        foreignKey: {
          name: 'group_member_group_uuid_fk',
          table: 'groups',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          },
          mapping: 'group_uuid',
          notNull: true
        }
      },
      user_uuid: {
        type: 'string',
        length: 36,
        foreignKey: {
          name: 'group_member_user_uuid_fk',
          table: 'users',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          },
          mapping: 'user_uuid',
          notNull: true
        }
      },
      is_admin: {
        type: 'smallint',
        notNull: true,
        defaultValue: 0
      },
      is_banned: {
        type: 'smallint',
        notNull: true,
        defaultValue: 0
      },
      banned_at: {
        type: 'timestamp',
        notNull: false
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
  return db.dropTable('group_members', callback)
}

exports._meta = {
  version: 1
}
