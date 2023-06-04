const mongoose = require("mongoose");
const createError = require("http-errors")

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true,"title is required"],
        minLength: [3,"title must be at least 3 characters"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    thumbnail: {
        type: String,
        required: [true,"thumbnail is required"]
    },
    content: {
        type: String,
        required: [true,"content is required"],
        minLength: [1,"content must be at least 1 characters"],
    },
    contentImages: {
        type:[String]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true,"author is required"]
    }
}, {
    timestamps: true
});


ArticleSchema.pre(['find', 'findOne'], async function(doc) {
    try {
        if (!!doc) {
            return await this
            .populate('author', {username:1})
        }
    } catch (error) {
        return createError(500, error.message)
    }
})


module.exports = mongoose.model("article", ArticleSchema);