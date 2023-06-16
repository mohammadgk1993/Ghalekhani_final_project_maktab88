const createError = require('http-errors')
const User = require('../models/User');


const loginValidator = async (req,res,next) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if (!user) return res.redirect(`/view/login?errorMessage=User not found!`);

        const isMatch = await user.validatePassword(req.body.password);
        if (!isMatch) return res.redirect(`/view/login?errorMessage=User not found!`);

        return next()
    } catch (error) {
        return next(createError(500, error.message))
    }
}

const registerValidator = async (req,res,next) => {
    try {
        const username = await User.findOne({username: req.body.username})
        if (!!username) {
            return res.redirect(`/view/register?errorMessage=username is already taken!`)
        }

        const phoneNumberCheck = await User.findOne({phoneNumber: req.body.phoneNumber})
        if (!!phoneNumberCheck) {
            return res.redirect(`/view/register?errorMessage=phone number is already taken!`)
        }
        
        if (!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(req.body.password)) {
            return res.redirect(`/view/register?errorMessage=password must contain of alphabets and numbers!`)
        } else if (!/^(\+98)9\d{9}$/.test(req.body.phoneNumber)) {
            return res.redirect(`/view/register?errorMessage=invalid phone number!`)
        } else if (!/^[a-zA-Z ,']+$/i.test(req.body.firstName)) {
            return res.redirect(`/view/register?errorMessage=invalid first name!`)
        } else if (!/^[a-zA-Z ,']+$/i.test(req.body.lastName)) {
            return res.redirect(`/view/register?errorMessage=invalid last name!`) 
        }

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