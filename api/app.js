require('module-alias/register')
require('express-group-routes')

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const generalMiddleware = require('@middleware/general')
const cors = require('cors')
const apiRouter = require('./routes/api')

// swagger
const swaggerUi = require('swagger-ui-express')
const openApiDocumentation = require('@utils/swagger/')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(generalMiddleware)

app.use(cors())

app.get('/', (req, res) => res.send('Welome to LMS API'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation))

app.group('/api', (router) => {
  apiRouter(router)
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  res.sendError(err, err.message, err.status)
})

module.exports = app
