const express = require('express');
const router = express.Router();
const { isLogin } = require('../middlewares/auth/auth');
const { roleAc } = require('../middlewares/ac/ac');
const {
    getUsersList
} = require("../controllers/adminControllers");



router.get("/getUsersList", isLogin, roleAc(["ADMIN"]), getUsersList);

// router.get("/test", isLogin, roleAc(["ADMIN", "BLOGGER"]), test);

// router.get("/sample", isLogin, roleAc(["BLOGGER"]), sample);

module.exports = router;
