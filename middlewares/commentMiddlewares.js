const Comment = require('../models/comment')
const Article = require('../models/Article')
const User = require('../models/User')
const createError = require('http-errors');


const createCommentValidator = async (req,res,next) => {
    try {
        if (!req.body.content) return next(createError(403, "content does not exist"))
        if (req.body.content.trim().length < 1) return next(createError(403, "invalid content"))
        const article = await Article.findById(req.body.article)
        if (!article) return next(createError(403, "article does not exist"))

        return next()
    } catch (error) {
        return next(createError(500, "Server Error"))
    }
}

const commentExistance = async (req,res,next) => {
    try {
        const comment = await Comment.findById(req.params.id)
        if (!!comment) return next()
        else return next(createError(404, "Not Found"))
    } catch (error) {
        return next(createError(500, "Server Error"))
    }
}

const access = async (req,res,next) => {
    try {
        const comment = await Comment.findById(req.params.id)
        const author = comment.author._id.toString()
        const user = await User.findById(req.session.user)
        const userId = user._id.toString()

        if (userId === author) {
            return next()
        } else if (userId !== author && user.role === 'admin') {
            return next()
        } else {
            return next(createError(403, 'Access Denied'))
        }
    } catch (error) {
        return next(createError(500, error.message))
    }
}

module.exports = {
    createCommentValidator,
    commentExistance,
    access
}