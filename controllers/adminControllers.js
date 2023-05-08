const createError = require('http-errors');
const url = require('url');
const path = require('path');
const fs = require('fs/promises');
const User = require("../models/User");


const getUsersList = async (req, res, next) => {
    const users = await User.find({role: "BLOGGER"}).lean();

    return res.json(users)
};



module.exports = {
    getUsersList
};