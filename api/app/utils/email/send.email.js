const EmailService = require('./email.service')
const jwt = require('jsonwebtoken')
const { API_JWT_KEY, API_JWT_EXPIRE, API_HOST } = process.env

class SendEmail {
  constructor() {
    this.sendEmailVerify = this.sendEmailVerify.bind(this)

    this.emailService = new EmailService()
  }

  sendEmailVerify(userObject) {
    const emailTemplatePath =
      'app/utils/email/templates/email-verification.html'
    const { name, email } = userObject
    const emailOptions = {
      to: email,
      subject: 'Email Verification'
    }

    const token = jwt.sign({ email: email }, API_JWT_KEY, {
      expiresIn: API_JWT_EXPIRE
    })

    const url = `${API_HOST}/api/auth/verify?token=${token}`

    const emailTemplate = {
      path: emailTemplatePath,
      data: {
        name: name,
        url: url
      }
    }

    try {
      const sendEmail = this.emailService.sendSingleMail(
        emailOptions,
        emailTemplate
      )
      return {
        success: sendEmail,
        erorr: null
      }
    } catch (err) {
      return {
        success: null,
        erorr: err
      }
    }
  }
}

module.exports = SendEmail
