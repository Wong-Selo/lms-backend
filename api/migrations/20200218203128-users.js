"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  return db.createTable(
    "users",
    {
      user_uuid: {
        type: "string",
        primaryKey: true,
        length: 36
      },
      name: { type: "string", notNull: true, length: 255 },
      email: {
        type: "string",
        notNull: true,
        length: 255,
        unique: true,
      },
      password: {
        type: "string",
        notNull: true,
        length: 255,
      },
      is_active: {
        type: 'smallint',
        notNull: true,
        defaultValue: 0
      },
      is_superuser: {
        type: 'smallint',
        notNull: true,
        defaultValue: 0
      },
      created_at: {
        type: "timestamp",
        notNull: false,
      },
      updated_at: {
        type: "timestamp",
        notNull: false,
      },
      deleted_at: {
        type: "timestamp",
        notNull: false,
      },
    },
    callback
  );
};

exports.down = function (db, callback) {
  return db.dropTable("users", callback);
};

exports._meta = {
  version: 1,
};
