const createHttpError = require("http-errors")
const Comment = require("../models/comment");
const User = require("../models/User")

const getAllComments = async (req,res,next) => {
    try {
        const id = await req.session.user
        const user = await User.findById(id)
        const comments = await Comment.find({article:req.query.article},{__v:0,updatedAt:0})
        .sort({createdAt: -1})
        console.log(user.role)
        res.render('pages/comments', {comments: comments, role: user.role, id: user._id})
        // res.json(comments).status(200)
    } catch (error) {
        return next(createHttpError(500, error.message))
    }
}

const createComment = async (req,res,next) => {
    try {
        const newComment = new Comment({})

        newComment.content = req.body.content
        newComment.article = req.body.article
        newComment.author = req.session.user

        await newComment.save()
        res.json(newComment).status(201)
    } catch (error) {
        return next(createHttpError(500, error.message))
    }
}

const readComment = async (req,res,next) => {
    try {
        const comment = await Comment.findOne({_id:req.params.id},{__v:0,updatedAt:0})
        return res.json(comment).status(200)
        // res.render("pages/comment", {comment:comment})
    } catch (error) {
        return next(createHttpError(500, error.message))
    }
}

const updateComment = async (req,res,next) => {
    try {
        if (!!req.body.content) {
            const comment = await Comment.findOneAndUpdate({_id:req.params.id}, {content:req.body.content})
            return res.json(comment).status(200)
        }
    } catch (error) {
        return next(createHttpError(500, "Server Error!"))
    }
}

const deleteComment = async (req,res,next) => {
    try {
        const comment = await Comment.findOneAndDelete({_id:req.params.id})
        return res.json(comment).status(200)
    } catch (error) {
        return next(createHttpError(500, "Server Error!"))
    }
}


module.exports = {
    getAllComments,
    createComment,
    readComment,
    updateComment,
    deleteComment
};