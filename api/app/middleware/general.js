const strings = require('@strings')

module.exports = (req, res, next) => {
    req.strings = strings.get(req.query.lang)

    // add code for middleware
    res.sendSuccess = (data, message = null, status = 200) => {
        return res.status(status).send({
            success: true,
            data: data,
            message: message ? message : req.strings.general.success
        })
    }

    res.sendError = (errors, message = null, status = 400) => {
        return res.status(status).send({
            success: false,
            errors: errors,
            message: message ? message : req.strings.errors.bad_request
        })
    }

    return next() // use next to go next router
}
