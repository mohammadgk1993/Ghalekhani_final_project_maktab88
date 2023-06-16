const createError = require('http-errors');
const url = require('url');
const path = require('path');
const fs = require('fs/promises');
const User = require("../models/User");
const Article = require("../models/Article");
const Comment = require("../models/comment");
const { userAvatarUpload } = require("../utils/multer-settings")
const bcrypt = require('bcryptjs');


const getAdminPanel= async (req,res,next) => {
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
        const users = await User.find({role:'blogger'},
        {createdAt:0,updatedAt:0,__v:0, password:0, role: 0})
        .skip(skip).limit(limit)

        const allUsers = await User.find({role:'blogger'})
        const totalPages = Math.ceil(allUsers.length / limit)
        // res.json(users).status(200)
        res.render('pages/admin', {users: users, total: totalPages})
    } catch (error) {
        return next(createError(500, error.message))
    }
}

const getRegisterPage = (req, res, next) => {
    if (req.session.user) return res.redirect("/view/dashboard");
    res.render("pages/log&sign", {errorMessage: req.query.errorMessage? req.query.errorMessage : null});
};

const registerUser = async (req, res, next) => {
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        avatar: "/images/userAvatars/icon.png"
    });

    try {
        await newUser.save();
        res.redirect("/view/login");
    } catch (err) {
        res.redirect(url.format({
            pathname:"/view/register",
            query: {
               "errorMessage": "Server Error!"
             }
        }))
    };
};

const getLoginPage = (req, res, next) => {
    if (req.session.user) return res.redirect("/view/dashboard");

    // let errorMessage = null;
    // if (req.query.errorMessage) errorMessage = req.query.errorMessage;
    const { errorMessage = null } = req.query;

    res.render("pages/log&sign", {errorMessage});
};

const loginUser = async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username});
        req.session.user = user._id;
        res.redirect("/view/dashboard");
    } catch (err) {
        res.redirect(url.format({
            pathname:"/view/login",
            query: {
               "errorMessage": "Server Error!"
             }
        }))
    };
};

const getDashboardPage = async (req, res, next) => {
    try {
        if (!req.session.user) return res.redirect("/view/login");
        const user = await User.findById(req.session.user)
        const { _id , firstName, lastName, username, gender, phoneNumber, role, avatar} = user
        res.render("pages/dashboard", {user: { _id , firstName, lastName, username, gender, phoneNumber, role, avatar}});
    } catch (error) {
        return next(createError(500, err.message))
    }
};

const logout = (req, res, next) => {
    req.session.destroy();

    res.redirect("/view/login");
};

const uploadAvatar = (req, res, next) => {
    const uploadUserAvatar = userAvatarUpload.single("avatar");

    uploadUserAvatar(req, res, async (err) => {
        if (err) {
            //delete if save with error
            // if (req.file) await fs.unlink(path.join(__dirname, "../public", req.file.filename))
            if (err.message) return res.status(400).send(err.message);
            return res.status(500).send("server error!");
        };

        if (!req.file) return res.status(400).send("File not send!");
        
        try {
            const id = req.session.user
            const user = await User.findById( id )
            // delete old avatar
            if (user.avatar != "/images/userAvatars/icon.png") {
                await fs.unlink(path.join(__dirname, "../public", user.avatar))
            }

            await User.findByIdAndUpdate( id, {
                avatar: "/images/userAvatars/" + req.file.filename
            }, {new: true});

            // req.session.user.avatar = user.avatar;
            
            // return res.json(user);
            res.redirect("/view/dashboard");
        } catch (err) {
            return next(createError(500, "Server Error!"))
        };
    });
};

const bulkUpload = (req, res, next) => {
    const uploadUserAvatar = userAvatarUpload.array("gallery");

    uploadUserAvatar(req, res, async (err) => {
        if (err) {
            if (err.message) return res.status(400).send(err.message);
            return res.status(500).send("server error!");
        };

        console.log(req.file);
        console.log(req.files);

        res.json({
            file: req.file,
            files: req.files
        });
    });
};

const updateUser = async (req, res, next) => {
    try {
        let updatedUser = {}
        const id = req.session.user
        console.log(id)

        if (!!req.body.firstName) updatedUser.firstName = req.body.firstName
        if (!!req.body.lastName) updatedUser.lastName = req.body.lastName
        if (!!req.body.password) updatedUser.password = req.body.password
        if (!!req.body.gender) updatedUser.gender = req.body.gender
        if (!!req.body.role) updatedUser.phoneNumber = req.body.phoneNumber

        const salt = bcrypt.genSalt(10);
        if (!!updatedUser.password) {
            updatedUser.password =  bcrypt.hash(updatedUser.password, salt);
        }
        
        const user = await User.findByIdAndUpdate(id, updatedUser)
        res.render('pages/dashboard', {user: { firstName, lastName, username, gender, phoneNumber, role, avatar}})
    } catch (error) {
        return next(createError(500, error.message))
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const id = await req.params.id
        const user = await User.findById(id)
        if (user.avatar != "/images/userAvatars/icon.png") {
            await fs.unlink(path.join(__dirname, "../public", user.avatar))
        }

        await User.findByIdAndDelete(id)
        const articles = await Article.find({author: id})

        for (let article of articles) {
            await fs.unlink(path.join(__dirname, "../public", article.thumbnail))
            if (!!article.contentImages) {
                for (let image of article.contentImages) {
                    await fs.unlink(path.join(__dirname, "../public", image))
                }
            }

            await Article.findByIdAndDelete(article._id)
            await Comment.deleteMany({article: article._id})
        }

        await Comment.deleteMany({author: id})
        if (user.role == 'admin') {
            console.log(role)
            res.json(user)
        } else {
            console.log(role)
            req.session.destroy();
            res.json(user)
        }

        console.log("user deleted")
    } catch (err) {
        return next(createError(500, err.message))
    }
}


module.exports = {
    getAdminPanel,
    getRegisterPage,
    registerUser,
    getLoginPage,
    loginUser,
    getDashboardPage,
    logout,
    uploadAvatar,
    bulkUpload,
    updateUser,
    deleteUser
};