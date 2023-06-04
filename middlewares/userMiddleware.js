const createError = require('http-errors')
const User = require('../models/User');
const { isTryStatement } = require('typescript');

const loginValidator = async (req,res,next) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if (!user) return res.redirect(`/user/login?errorMessage=User not found!`);

        const isMatch = await user.validatePassword(req.body.password);
        if (!isMatch) return res.redirect(`/user/login?errorMessage=User not found!`);

        return next()
    } catch (error) {
        return next(createError(500, error.message))
    }
}

const registerValidator = async (req,res,next) => {
    try {
        const user = User.findOne({username: req.body.username})
        if (!!user) return res.redirect(`/view/register?errorMessage=username Already exist!`)
        return next()
    } catch (error) {
        return next(createError(500, error.message))
    }
}

const accessValidator = async (req,res,next) => {
    try {
        const user = await User.findById(req.session.user)
        if (req.session.user != req.params.id && user.role == 'admin') {
            return next()
        } else if (req.session.user == req.params.id) {
            return next()
        } else {
            return next(createError(403, 'Access Denied'))
        }
    } catch (error) {
        return next(createError(500, error.message))
    }
}


module.exports = {
    loginValidator,
    registerValidator,
    accessValidator
}