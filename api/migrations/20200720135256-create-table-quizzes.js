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
    'quizzes',
    {
      quizz_uuid: {
        type: 'string',
        primaryKey: true,
        length: 36
      },
      group_uuid: {
        type: 'string',
        length: 36,
        foreignKey: {
          name: 'quizz_group_uuid_fk',
          table: 'groups',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          },
          mapping: 'group_uuid',
          notNull: false
        }
      },
      user_uuid: {
        type: 'string',
        length: 36,
        foreignKey: {
          name: 'quizz_user_uuid_fk',
          table: 'users',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          },
          mapping: 'user_uuid',
          notNull: false
        }
      },
      quizz_name: {
        type: 'string',
        notNull: true
      },
      quizz_description: {
        type: 'text',
        notNull: false
      },
      duration: { type: 'integer', notNull: true, defaultValue: 60 },
      is_private: {
        type: 'smallint',
        notNull: true,
        defaultValue: 0
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
  return db.dropTable('quizzes', callback)
}

exports._meta = {
  version: 1
}
