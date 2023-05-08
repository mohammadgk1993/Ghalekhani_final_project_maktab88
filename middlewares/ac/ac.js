const createError = require('http-errors');


const roleAc = (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.session.user.role)) return next();
        return next(createError(403, "Access Denied!"))
    };
};


module.exports = {
    roleAc
};