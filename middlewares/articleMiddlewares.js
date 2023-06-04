const createHttpError = require("http-errors")
const Article = require("../models/Article")
const User = require("../models/User")

const articleExistance = (req,res,next) => {
    try {
        const article = Article.findById(req.params.id)
        if (!!article) return next()
        else return next(createHttpError(404, "Not Found"))
    } catch (error) {
        return next(createHttpError(500, "Server Error"))
    }
}

const checkUserExistance = (req,res,next) => {
    try {
        const user = User.findOne({username: req.body.author})
        if (!!user) return next()
        else return next(createHttpError(400, "Bad Request"))
    } catch (error) {
        return next(createHttpError(500, "Server Error"))
    }
}

const checkArticleOwner = (req,res,next) => {
    try {
        const article = Article.findById(req.params.id).populate("author")
        if (article.author == req.session.user.username) return next()
        else return next(createHttpError(403, "Permsion Denied"))
    } catch (error) {
        return next(createHttpError(500, "Server Error"))
    }
}

module.exports = { articleExistance, checkUserExistance , checkArticleOwner}