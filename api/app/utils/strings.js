const fs = require('fs')

module.exports = {
  get: (lang = 'en') => {
    const rawData = fs.readFileSync(`app/utils/strings/${lang}.json`)
    const strings = JSON.parse(rawData)
    return strings
  }
}
