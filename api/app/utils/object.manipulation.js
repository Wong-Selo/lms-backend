'use strict'

class DeleteKeyObject {
  constructor() {
    this.deleteKey = this.deleteKey.bind(this)
  }

  deleteKey(object, keys) {
    object = keys.forEach((index) => delete object[index])
    return object
  }
}

module.exports = DeleteKeyObject
