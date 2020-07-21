'use strict'

const validator = require('@utils/validator')
const UserModel = require('@model/user.model')
const GroupModel = require('@model/group.model')
const GroupMemberModel = require('@model/group.member.model')
const QuizzModel = require('@model/quizz.model')
const QuestionModel = require('@model/question.model')
const QuestionChoiceModel = require('@model/question.choice.model')
const ObjectManipulation = require('@utils/object.manipulation')

class QuizzController {
  constructor() {
    this.quizzModel = new QuizzModel()
    this.userModel = new UserModel()
    this.groupModel = new GroupModel()
    this.groupMemberModel = new GroupMemberModel()
    this.questionModel = new QuestionModel()
    this.questionChoiceModel = new QuestionChoiceModel()
    this.objectManipulation = new ObjectManipulation()

    this.createQuizz = this.createQuizz.bind(this)
    this.getQuizzes = this.getQuizzes.bind(this)
    this.getQuiz = this.getQuiz.bind(this)
  }

  async _userHasMember(req, res, groupId, userId) {
    let { user_uuid } = req.user
    user_uuid = userId ? userId : user_uuid

    const { errors, data } = await this.groupMemberModel.userHasJoin(
      user_uuid,
      groupId
    )

    if (errors) return res.sendError(errors)

    if (!data)
      return res.sendError(
        {
          user_uuid: req.strings.errors.group.not_member.replace(
            '$_variable',
            user_uuid
          )
        },
        req.strings.errors.group.not_member.replace('$_variable', user_uuid)
      )
  }

  async createQuizz(req, res) {
    const { user_uuid } = req.user
    let {
      group_uuid,
      name: quiz_name,
      description: quiz_description,
      duration,
      is_private
    } = req.body

    const requires = ['name', 'description', 'duration', 'is_private']
    let errors = validator.checkBody(req.body, requires, req.strings)
    if (errors) return res.sendError(errors)

    if (group_uuid) {
      is_private = 1

      const {
        data: groupExist,
        errors: getGroupError
      } = await this.groupModel.getGroupById(group_uuid)
      if (getGroupError) return res.sendError(getGroupError)

      if (!groupExist)
        return res.sendError(
          {
            name: req.strings.errors.group.group_doesnt_exist.replace(
              '$_variable',
              group_uuid
            )
          },
          req.strings.errors.group.group_doesnt_exist.replace(
            '$_variable',
            group_uuid
          )
        )

      await this._userHasMember(req, res, group_uuid, null)
    }

    const dataToInsert = {
      group_uuid,
      user_uuid,
      quiz_name,
      quiz_description,
      duration,
      is_private
    }

    const {
      insertId,
      data,
      errors: insertError
    } = await this.quizzModel.createQuizz(dataToInsert)
    if (insertError) return res.sendError(insertError)

    return res.sendSuccess({ insertId: insertId, ...data })
  }

  async getQuizzes(req, res) {
    const { user_uuid } = req.user
    const {
      data: quizzes,
      errors: quizzesError
    } = await this.quizzModel.getByUserId(user_uuid)

    if (quizzesError) return res.sendError(quizzesError)

    return res.sendSuccess(quizzes)
  }

  async getQuiz(req, res) {
    const { id: quizId } = req.params

    let {
      data: dataQuiz,
      errors: errorGetQuiz
    } = await this.quizzModel.getByQuizId(quizId)
    if (errorGetQuiz) return res.sendError(errorGetQuiz)

    let {
      data: dataQuestion,
      errors: errorGetQuestion
    } = await this.questionModel.getQuestionByQuizId(quizId)
    if (errorGetQuestion) return res.sendError(errorGetQuestion)

    for (const question of dataQuestion) {
      const { question_uuid } = question
      const {
        data: choicesData
      } = await this.questionChoiceModel.getChoicesByQuestionId(question_uuid)
      question.choices = choicesData
    }

    return await res.sendSuccess({
      ...dataQuiz,
      questions: dataQuestion
    })
  }
}

module.exports = QuizzController
