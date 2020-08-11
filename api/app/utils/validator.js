function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}
module.exports = {
  checkBody: function (reqBody, requires, strings) {
    var errors = {}
    for (var i in requires) {
      if (
        typeof reqBody[requires[i]] === 'undefined' ||
        reqBody[requires[i]] === ''
      ) {
        errors[requires[i]] = strings.errors.required.replace(
          '$_variable',
          requires[i]
        )
      } else if (
        requires[i] == 'email' &&
        !validateEmail(reqBody[requires[i]])
      ) {
        errors[requires[i]] = strings.errors.email.invalid
      }
    }

    if (Object.getOwnPropertyNames(errors).length > 0) {
      return errors
    }
    return false
  },

  checkWordLength: function (word, maxLength) {
    if (word.length > maxLength) return false
    return true
  }
}
