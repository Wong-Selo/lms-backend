'use strict'

const validator = require('@utils/validator')
const UserModel = require('@model/user.model')
const GroupModel = require('@model/group.model')
const GroupMemberModel = require('@model/group.member.model')
const QuizzModel = require('@model/quizz.model')
const QuestionModel = require('@model/question.model')
const QuestionChoiceModel = require('@model/question.choice.model')
const ObjectManipulation = require('@utils/object.manipulation')
const UUID = require('uuid')

class QuizzController {
  constructor() {
    this.quizzModel = new QuizzModel()
    this.userModel = new UserModel()
    this.groupModel = new GroupModel()
    this.groupMemberModel = new GroupMemberModel()
    this.questionModel = new QuestionModel()
    this.questionChoiceModel = new QuestionChoiceModel()
    this.objectManipulation = new ObjectManipulation()

    this.createQuestion = this.createQuestion.bind(this)
    this.getQuestion = this.getQuestion.bind(this)
    this.deleteQuestion = this.deleteQuestion.bind(this)
  }

  async createQuestion(req, res) {
    const { quiz_uuid, questions } = req.body

    const requires = ['quiz_uuid', 'questions']
    let errors = validator.checkBody(req.body, requires, req.strings)
    if (errors) return res.sendError(errors)

    if (!Array.isArray(questions) || !questions.length) {
      return res.sendError(
        {
          questions: req.strings.errors.must_an_array
        },
        req.strings.errors.must_an_array
      )
    }

    const {
      data: quizExist,
      errors: quizError
    } = await this.quizzModel.getByQuizId(quiz_uuid)
    if (quizError) return res.sendError(quizError)

    if (!quizExist)
      return res.sendError({
        quiz_uuid: req.strings.errors.quiz.not_found
      })

    /**
     * Validate all questions array input
     */
    let errObj = []
    const questionDataObj = []
    for (const idx in questions) {
      const questionRequires = ['content', 'type', 'answer']
      let errors = validator.checkBody(
        questions[idx],
        questionRequires,
        req.strings
      )
      if (errors)
        errObj.push({
          array: idx,
          errors: errors
        })

      const { type, choices, content, answer } = questions[idx]

      const types = ['multiple', 'short_answer', 'essay']
      if (!types.includes(type)) {
        const msg = req.strings.errors.question.not_in_types.replace(
          '$_variable',
          types
        )
        errObj.push({
          array: idx,
          errors: msg
        })
      }

      // if choices is multiple, body must contains choices
      if (type === 'multiple' && (!choices || !Array.isArray(choices))) {
        errObj.push({
          array: idx,
          errors: req.strings.errors.question.must_contain_choices
        })
      }

      questionDataObj.push({
        question_uuid: UUID.v4(),
        quiz_uuid,
        type,
        content,
        answer,
        choices
      })
    }

    if (errObj.length) return res.sendError({ questions: errObj })

    const {
      errors: createQuestionError
    } = await this.questionModel.createQuestions(questionDataObj)
    if (createQuestionError) return res.sendError(createQuestionError)

    // set to array
    let dataChoicesToInsert = questionDataObj.filter(
      (item) => item.type === 'multiple'
    )

    dataChoicesToInsert = dataChoicesToInsert.map((item) => {
      this.objectManipulation.deleteKey(item, [
        'quiz_uuid',
        'type',
        'content',
        'answer'
      ])
      return item
    })

    const {
      errors: insertChoices
    } = await this.questionChoiceModel.createChoices(dataChoicesToInsert)

    if (insertChoices) return res.sendError(insertChoices)

    return res.sendSuccess()
  }

  async getQuestion(req, res) {
    const { id: question_uuid } = req.params
    const {
      data: question,
      errors: getQuestionError
    } = await this.questionModel.getQuestionById(question_uuid)

    if (getQuestionError) return res.sendError(getQuestionError)
    if (!question)
      return res.sendError(
        {
          question_uuid: req.strings.errors.question.not_found
        },
        req.strings.errors.question.not_found
      )

    const {
      data: choices,
      errors: getChoicesError
    } = await this.questionChoiceModel.getChoicesByQuestionId(question_uuid)
    if (getChoicesError) return res.sendError(getChoicesError)

    return res.sendSuccess({ ...question, choices })
  }

  async deleteQuestion(req, res) {
    const { id: question_uuid } = req.params
    const {
      data: question,
      errors: getQuestionError
    } = await this.questionModel.getQuestionById(question_uuid)

    if (getQuestionError) return res.sendError(getQuestionError)
    if (!question)
      return res.sendError(
        {
          question_uuid: req.strings.errors.question.not_found
        },
        req.strings.errors.question.not_found
      )

    const { errors: deleteError } = await this.questionModel.delete(
      question_uuid
    )
    if (deleteError) return res.sendError(deleteError)

    return res.sendSuccess()
  }
}

module.exports = QuizzController
