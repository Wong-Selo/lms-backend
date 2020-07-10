const DBConnection = require("@utils/database");

class UserModel {
  constructor() {
    this.dbConnection = new DBConnection();
    this.table = "users";
  }
}

module.exports = UserModel;
