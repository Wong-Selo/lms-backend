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
    'questions',
    {
      question_uuid: {
        type: 'string',
        primaryKey: true,
        length: 36
      },
      quiz_uuid: {
        type: 'string',
        length: 36,
        foreignKey: {
          name: 'question_quiz_uuid_fk',
          table: 'quizzes',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          },
          mapping: 'quiz_uuid'
        },
        notNull: true
      },
      content: {
        type: 'text',
        notNull: true
      },
      answer: {
        type: 'string',
        notNull: true
      },
      type: {
        type: 'string',
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
  return db.dropTable('questions', callback)
}

exports._meta = {
  version: 1
}
