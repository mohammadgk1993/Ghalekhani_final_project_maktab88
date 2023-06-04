const createError = require('http-errors');
const url = require('url');
const path = require('path');
const fs = require('fs/promises');
const Article = require("../models/Article");
const User = require('../models/User');
const { thumbnailAvatarUpload } = require('../utils/multer-settings');


const createArticlePage = async (req,res,next) => {
    try {
        res.render('pages/create-article') 
    } catch (error) {
        return next(createError(500, error.message))
    }
}

const getAllArticles = async (req,res,next) => {
    try {
        let page = 1
        let limit = 6
        if (!!req.query.page && req.query.page > 0) {
            page = req.query.page
        }
        
        if (!!req.query.limit && req.query.limit > 0) {
            limit = req.query.limit
        }

        const skip = (page - 1) * limit

        if (!!req.query.user) {
            const articles = await Article.find({author:req.query.user},{__v:0,updatedAt:0})
            .skip(skip).limit(limit)
            .populate('author', {username:1})
            const totalPages = Math.ceil(articles.length / limit)
            // res.json(articles).status(200)
            res.render('pages/myArticles', {articles: articles, total: totalPages}) 
        } else {
            const articles = await Article.find({},{__v:0,updatedAt:0})
            const totalPages = Math.ceil(articles.length / limit)
            // return res.json(articles).status(200)
            res.render('pages/explore', {articles: articles, total: totalPages})
        }
    } catch (error) {
        return next(createError(500, error.message))
    }
}

const createArticle = async (req,res,next) => {
    try {
        const newArticle = new Article({})

        newArticle.title = req.body.title
        newArticle.thumbnail = req.files.thumbnail[0].path.slice(6)
        newArticle.content = req.body.content
        newArticle.contentImages = 
        req.files.contentImages.map(val => val.path.slice(6))
        // newArticle.author = req.session.user
        newArticle.author = req.body.author

        await newArticle.save()
        res.json(newArticle).status(201)
        // res.redirect("pages/explore")

    } catch (error) {
        return next(createError(500, error.message))
    }
}

const readArticle = async (req,res,next) => {
    try {
        if (!req.session) {
            next(createError(403, 'permission denied'))
        }
        // const article = await Article.findById(req.params.id)
        const article = await Article.findOne({_id: req.params.id})
        // return res.json(article).status(200)
        res.render("pages/article", {article:article})
    } catch (error) {
        return next(createError(500, error.message))
    }
}

const updateArticle = async (req,res,next) => {
    try {
        console.log(req.files.contentImages)
        const updatedArticle = {}
        let article = await Article.findById(req.params.id)

        if (!!req.body.title) updatedArticle.title = req.body.title
        if (!!req.body.content) updatedArticle.content = req.body.title
        if (!!req.files.thumbnail[0]) {
            await fs.unlink(path.join(__dirname, "../public", article.thumbnail))
            updatedArticle.thumbnail = "/images/articleAvatars/" + req.files.thumbnail[0].filename
        }

        if(!!req.files.contentImages && req.files.contentImages.length > 0) {
            console.log(req.files.contentImages)
            for (let image of article.contentImages) {
                await fs.unlink(path.join(__dirname, "../public", image))
            }

            updatedArticle.contentImages = req.files.contentImages.map(val => val.path.slice(6))
        }

        article = await Article.findByIdAndUpdate(req.params.id, updatedArticle)
        return res.json(article).status(200)
    } catch (error) {
        console.log(error)
        return next(createError(500, error.message))
    }
}

const deleteArticle = async (req,res,next) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id)
        await fs.unlink(path.join(__dirname, "../public", article.thumbnail))
        if (!!article.contentImages) {
            for (let image of article.contentImages) {
                await fs.unlink(path.join(__dirname, "../public", image))
            }
        }
        return res.json(article).status(200)
    } catch (error) {
        console.log(error)
        return next(createError(500, "Server Error!"))
    }
}


module.exports = {
    getAllArticles,
    // getUserArticles,
    createArticle,
    readArticle,
    updateArticle,
    deleteArticle,
    createArticlePage
};