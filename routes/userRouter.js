const express = require('express');
const router = express.Router();
const { roleAc } = require('../middlewares/ac/ac')
const { isLogin } = require('../middlewares/auth/auth');
const {
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
} = require("../controllers/userControllers");
const { loginValidator, registerValidator, accessValidator } = require('../middlewares/userMiddleware');


router.post("/register", 
// registerValidator, 
registerUser)

router.post("/login", loginValidator, loginUser);

router.get("/logout", isLogin, logout);

router.post("/uploadAvatar", isLogin, uploadAvatar)

// router.post("/bulkUpload", isLogin, bulkUpload)

router.patch("/", isLogin, updateUser)

router.delete("/:id", isLogin, accessValidator, deleteUser)


module.exports = router;