const createError = require('http-errors');


const isLogin = (req, res, next) => {
    if (req.session.user) return next();
    return next(createError(401, "auth error!"))
};


module.exports = {
    isLogin
};