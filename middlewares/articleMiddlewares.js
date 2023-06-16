const createHttpError = require("http-errors")
const Article = require("../models/Article")
const User = require("../models/User")
const fs = require('node:fs/promises')
const path = require('node:path')


const articleExistance = async (req,res,next) => {
    try {
        const article = await Article.findById(req.params.id)
        if (!!article) return next()
        else return next(createHttpError(404, "Not Found"))
    } catch (error) {
        return next(createHttpError(500, "Server Error"))
    }
}

// const articleUpdateValidator = async (req,res,next) => {
//     try {
//         if (!!req.body.title && req.body.title < 3) {
//             return next(createError(403, 'title must be at least 3 characters'))
//         }
    
//         if (!!req.body.content && req.body.content < 3) {
//             return next(createError(403, 'content must be at least 3 characters'))
//         }
//     } catch (error) {
//         return next(createError(500, error.message))
//     }
// }

const access = async (req,res,next) => {
    try {
        const article = await Article.findById(req.params.id)
        const author = article.author._id.toString()
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
    articleExistance,
    access
}