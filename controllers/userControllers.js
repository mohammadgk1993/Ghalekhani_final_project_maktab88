const createError = require('http-errors');
const url = require('url');
const path = require('path');
const fs = require('fs/promises');
const User = require("../models/User");
const { userAvatarUpload } = require("../utils/multer-settings")
const bcrypt = require('bcryptjs');


const getRegisterPage = (req, res, next) => {
    if (req.session.user) return res.redirect("/user/dashboard");
    res.render("pages/register", {errorMessage: req.query.errorMessage? req.query.errorMessage : null});
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

        // res.render("pages/login");
        res.redirect("/user/login");
    } catch (err) {
        // res.render("pages/register", {errorMessage: "Server Error!"});
        res.redirect(url.format({
            pathname:"/user/register",
            query: {
               "errorMessage": "Server Error!"
             }
          }))
        //   res.redirect(`/user/register?errorMessage=Server Error`);
    };
};


const getLoginPage = (req, res, next) => {
    if (req.session.user) return res.redirect("/user/dashboard");

    // let errorMessage = null;
    // if (req.query.errorMessage) errorMessage = req.query.errorMessage;
    const { errorMessage = null } = req.query;

    res.render("pages/login", {errorMessage});
};


const loginUser = async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if (!user) return res.redirect(`/user/login?errorMessage=User not found!`);

        const isMatch = await user.validatePassword(req.body.password);
        if (!isMatch) return res.redirect(`/user/login?errorMessage=User not found!`);

        req.session.user = user;
        res.redirect("/user/dashboard");
    } catch (err) {
        res.redirect(url.format({
            pathname:"/user/login",
            query: {
               "errorMessage": "Server Error!"
             }
        }))
    };
};


const getDashboardPage = (req, res, next) => {
    if (!req.session.user) return res.redirect("/user/login");

    res.render("pages/dashboard", {user: req.session.user});
};


const logout = (req, res, next) => {
    req.session.destroy();

    res.redirect("/user/login");
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
            // delete old avatar
            if (req.session.user.avatar != "/images/userAvatars/icon.png") {
                await fs.unlink(path.join(__dirname, "../public", req.session.user.avatar))
            }

            const user = await User.findByIdAndUpdate(req.session.user._id, {
                avatar: "/images/userAvatars/" + req.file.filename
            }, {new: true});
            
            req.session.user.avatar = user.avatar;
            
            // return res.json(user);
            res.redirect("/user/dashboard");
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

const updateUser = (req, res, next) => {
    let updatedUser = {}
    const id = req.session.user._id
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

    console.log(req.body)
    User.findByIdAndUpdate(id,updatedUser)
    .then(data => {
        req.session.user = {...req.session.user,...updatedUser}
        req.session.reload(function(err) {
            if (err) {
                console.log(err)
            }
        });
        console.log(req.session.user)
        const {firstName,lastName,username,password,gender,phoneNumber} = req.session.user
        res.json({firstName,lastName,username,password,gender,phoneNumber})
    })
    .catch(err => next(createError(500, err.message)));
}


const deleteUser = async (req, res, next) => {
    try {
        await User.deleteOne({username:req.session.user.username})
        if (req.session.user.avatar != "/images/userAvatars/icon.png") {
            await fs.unlink(path.join(__dirname, "../public", req.session.user.avatar))
        }
        req.session.destroy();
        console.log("ok")
        res.json(data)
    } catch (err) {
        next(createError(500, err.message))
    }
}


module.exports = {
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