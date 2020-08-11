'use strict'

const validator = require('@utils/validator')
const UserModel = require('@model/user.model')
const ProfileModel = require('@model/profile.model')
const ObjectManipulation = require('@utils/object.manipulation')

class ProfileController {
  constructor() {
    this.userModel = new UserModel()
    this.profileModel = new ProfileModel()
    this.objectManipulation = new ObjectManipulation()

    this.updateProfile = this.updateProfile.bind(this)
    this.getProfile = this.getProfile.bind(this)
  }

  async updateProfile(req, res) {
    const { user_uuid } = req.user
    const {
      bio,
      birth_date,
      website,
      phone,
      twitter,
      facebook,
      instagram
    } = req.body

    const requires = ['bio']
    let errors = validator.checkBody(req.body, requires, req.strings)
    if (errors) return res.sendError(errors)

    const {
      data: isExist,
      errors: getProfileError
    } = await this.profileModel.getProfile(user_uuid)
    if (getProfileError) return res.sendError(getProfileError)

    if (!isExist) {
      const data = {
        user_uuid,
        bio,
        birth_date,
        website,
        phone,
        twitter,
        facebook,
        instagram,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { errors: createError } = await this.profileModel.createProfile(
        data
      )
      if (createError) return res.sendError(createError)
    } else {
      const currentBirthDate = isExist.birth_date
        ? isExist.birth_date.toISOString()
        : null
      const data = {
        bio: bio || isExist.bio,
        birth_date: birth_date || currentBirthDate,
        website: website || isExist.website,
        phone: phone || isExist.phone,
        twitter: twitter || isExist.twitter,
        facebook: facebook || isExist.facebook,
        instagram: instagram || isExist.instagram,
        updated_at: new Date().toISOString()
      }
      const { errors: updateError } = await this.profileModel.updateByUserId(
        user_uuid,
        data
      )
      if (updateError) return res.sendError(updateError)
    }

    return res.sendSuccess()
  }

  async getProfile(req, res) {
    const { user_uuid } = req.user

    const {
      data: isExist,
      errors: getProfileError
    } = await this.profileModel.getProfile(user_uuid)
    if (getProfileError) return res.sendError(getProfileError)

    if (!isExist) {
      const {
        errors: errorCreateProfile
      } = await this.profileModel.createProfile({
        user_uuid,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      if (errorCreateProfile) return res.sendError(errorCreateProfile)
    }

    const { data: profile } = await this.profileModel.getProfile(user_uuid)

    return res.sendSuccess(profile)
  }
}

module.exports = ProfileController
