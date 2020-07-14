const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const fs = require('fs')

const {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_SECURE,
  MAIL_USER,
  MAIL_PASS,
  FROM_NODEMAILER
} = process.env

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: MAIL_SECURE === 'true',
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS
  }
})
class EmailService {
  constructor() {
    this.transporter = transporter
    this.sendSingleMail = this.sendSingleMail.bind(this)
    this.customContext = this.customContext.bind(this)
  }

  /**
   * 
   * @param {object} options 
      const options = {
        from: 'Learning Management System <hi@lms.com>',
        to: 'User 1 <foo@bar.com>',
        subject: 'Reset Password',
        text: 'For clients with plaintext support only',
        html: '<p>Your HTML</p>',
      }

      if `from` not define use default value from file .env
   * @param {object} template 
      const template = {
        path: 'app/utils/email/template/register.html'
        data: {
          url: "http://lms.com/set-password",
          token: "uuid-1234"
        }
      }

      if use template, options.html will be replaced
   */
  sendSingleMail(options, template = null) {
    return new Promise(async (resolve, reject) => {
      // if options not contains 'from'
      if (options && !options.from) {
        options.from = FROM_NODEMAILER
      }

      if (template) {
        const htmlToSend = await this.customContext(template)
        if (htmlToSend.err) {
          return reject(htmlToSend.err)
        } else if (htmlToSend.html) {
          options.html = htmlToSend.html
        }
      }

      this.transporter.sendMail(options, (err) => {
        if (err) return reject(err)

        return resolve()
      })
    })
  }

  async customContext(templateObj) {
    return new Promise((resolve, reject) => {
      fs.readFile(templateObj.path, { encoding: 'utf-8' }, function (
        err,
        html
      ) {
        if (err) return resolve({ err: err, html: null })

        const template = handlebars.compile(html)
        const htmlToSend = template(templateObj.data)

        return resolve({ err: null, html: htmlToSend })
      })
    })
  }
}

module.exports = EmailService
