const express = require('express');
const router = express.Router();

const {
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
} = require("../controllers/userControllers");

const { isLogin } = require('../middlewares/auth/auth');



router.get("/register", getRegisterPage);
router.post("/register", registerUser)

router.get("/login", getLoginPage);
router.post("/login", loginUser);

router.get("/dashboard", getDashboardPage);

router.get("/logout", isLogin, logout);

router.post("/uploadAvatar", isLogin, uploadAvatar)

router.post("/bulkUpload", bulkUpload)

router.patch("/", updateUser)

router.delete("/", deleteUser)

module.exports = router;
