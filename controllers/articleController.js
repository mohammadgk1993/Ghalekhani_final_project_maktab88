const createError = require('http-errors');
const url = require('url');
const path = require('path');
const fs = require('fs/promises');
const Article = require("../models/Article");
const { userAvatarUpload } = require("../utils/multer-settings")


const getAllArticles = async (req,res,next) => {
    try {
        if (!!req.query.username) {
            const articles = await Article.find({author:req.query.username},{__v:0,updatedAt:0})
            // res.json(articles).status(200)
            res.render('pages/myArticles', {articles: articles}) 
        } else {
            const articles = await Article.find({},{__v:0,updatedAt:0})
            // return res.json(articles).status(200)
            res.render('pages/explore', {articles: articles})
        }
    } catch (error) {
        return next(createError(500, error.message))
    }
}


const createArticle = async (req,res,next) => {
    try {
        const newArticle = new Article({})

        newArticle.title = req.body.title
        newArticle.thumbnail = req.body.thumbnail
        newArticle.content = req.body.content
        newArticle.author = req.body.author
        
        if (!!req.body.description) newArticle.description
        if (!!req.body.contentImages) newArticle.contentImages

        await newArticle.save()
        return res.json(newArticle).status(201)
    } catch (error) {
        return next(createError(500, error.message))
    }
}


const readArticle = async (req,res,next) => {
    try {
        const article = await Article.findById(req.params.id)
        // return res.json(article).status(200)
        res.render("pages/article", {article:article})
    } catch (error) {
        return next(createError(500, error.message))
    }
}


const updateArticle = async (req,res,next) => {
    try {
        const updatedArticle = {}

        if (!!req.body.title) updatedArticle.title = req.body.title
        if (!!req.body.description) updatedArticle.description = req.body.description
        if (!!req.body.thumbnail) updatedArticle.thumbnail = req.body.thumbnail
        if (!!req.body.contentImages) updatedArticle.contentImages = req.body.contentImages
        if (!!req.body.content) updatedArticle.content = req.body.content

        const article = await Article.findByIdAndUpdate(req.params.id, updatedArticle)
        return res.json(article).status(200)
    } catch (error) {
        return next(createError(500, "Server Error!"))
    }
}

const deleteArticle = async (req,res,next) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id)
        return res.json(article).status(200)
    } catch (error) {
        return next(createError(500, "Server Error!"))
    }
}


module.exports = {
    getAllArticles,
    // getUserArticles,
    createArticle,
    readArticle,
    updateArticle,
    deleteArticle
};


// const registerUser = async (req, res, next) => {
//     const newUser = new User({
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         username: req.body.username,
//         password: req.body.password,
//         phoneNumber: req.body.phoneNumber,
//         avatar: "/images/userAvatars/icon.png"
//     });

//     try {
//         await newUser.save();

//         // res.render("pages/login");
//         res.redirect("/user/login");
//     } catch (err) {
//         // res.render("pages/register", {errorMessage: "Server Error!"});
//         res.redirect(url.format({
//             pathname:"/user/register",
//             query: {
//                "errorMessage": "Server Error!"
//              }
//           }))
//         //   res.redirect(`/user/register?errorMessage=Server Error`);
//     };
// };


// const uploadAvatar = (req, res, next) => {
//     const uploadUserAvatar = userAvatarUpload.single("avatar");

//     uploadUserAvatar(req, res, async (err) => {
//         if (err) {
//             //delete if save with error
//             // if (req.file) await fs.unlink(path.join(__dirname, "../public", req.file.filename))
//             if (err.message) return res.status(400).send(err.message);
//             return res.status(500).send("server error!");
//         };

//         if (!req.file) return res.status(400).send("File not send!");
        
//         try {
//             // delete old avatar
//             if (req.session.user.avatar != "/images/userAvatars/icon.png") {
//                 await fs.unlink(path.join(__dirname, "../public", req.session.user.avatar))
//             }

//             const user = await User.findByIdAndUpdate(req.session.user._id, {
//                 avatar: "/images/userAvatars/" + req.file.filename
//             }, {new: true});
            
//             req.session.user.avatar = user.avatar;
            
//             // return res.json(user);
//             res.redirect("/user/dashboard");
//         } catch (err) {
//             return next(createError(500, "Server Error!"))
//         };
//     });
// };


// const bulkUpload = (req, res, next) => {
//     const uploadUserAvatar = userAvatarUpload.array("gallery");

//     uploadUserAvatar(req, res, async (err) => {
//         if (err) {
//             if (err.message) return res.status(400).send(err.message);
//             return res.status(500).send("server error!");
//         };

//         console.log(req.file);
//         console.log(req.files);

//         res.json({
//             file: req.file,
//             files: req.files
//         });
//     });
// };

// const updateUser = (req, res, next) => {
//     let updatedUser = {}
//     const id = req.session.user._id
//     console.log(id)

//     if (!!req.body.firstName) updatedUser.firstName = req.body.firstName
//     if (!!req.body.lastName) updatedUser.lastName = req.body.lastName
//     if (!!req.body.password) updatedUser.password = req.body.password
//     if (!!req.body.gender) updatedUser.gender = req.body.gender
//     if (!!req.body.role) updatedUser.phoneNumber = req.body.phoneNumber

//     const salt = bcrypt.genSalt(10);
//     if (!!updatedUser.password) {
//         updatedUser.password =  bcrypt.hash(updatedUser.password, salt);
//     }

//     console.log(req.body)
//     User.findByIdAndUpdate(id,updatedUser)
//     .then(data => {
//         req.session.user = {...req.session.user,...updatedUser}
//         req.session.reload(function(err) {
//             if (err) {
//                 console.log(err)
//             }
//         });
//         console.log(req.session.user)
//         const {firstName,lastName,username,password,gender,phoneNumber} = req.session.user
//         res.json({firstName,lastName,username,password,gender,phoneNumber})
//     })
//     .catch(err => next(createError(500, err.message)));
// }


// const deleteUser = async (req, res, next) => {
//     try {
//         await User.deleteOne({username:req.session.user.username})
//         if (req.session.user.avatar != "/images/userAvatars/icon.png") {
//             await fs.unlink(path.join(__dirname, "../public", req.session.user.avatar))
//         }
//         req.session.destroy();
//         console.log("ok")
//         res.json(data)
//     } catch (err) {
//         next(createError(500, err.message))
//     }
// }