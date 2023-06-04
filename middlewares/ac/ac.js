const createError = require('http-errors');
const User = require('../../models/User')

const roleAc = (roles) => {
    return async (req, res, next) => {
        const user = await User.findById(req.session.user)
        if (roles.includes(user.role)) return next();
        return next(createError(403, "Access Denied!"))
    };
};


module.exports = {
    roleAc
};