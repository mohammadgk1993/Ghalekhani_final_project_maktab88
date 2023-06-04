const mongoose = require("mongoose");
const createError = require('http-errors');


const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true,"content is required"],
        minLength: [1,"content must be at least 1 characters"],
        trim: true
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'article',
        required: [true, "article Id is required"]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true,"author is required"]
    }
}, {
    timestamps: true
});


CommentSchema.pre(['find', 'findOne', 'findOneAndUpdate', 'findOneAndDelete'], async function(doc) {
    try {
        if (!!doc) {
            return await this
            .populate('author', {username:1,avatar:1})
            .populate('article', {author:1})
        }
    } catch (error) {
        return createError(500, error.message)
    }
})


module.exports = mongoose.model("comment", CommentSchema);