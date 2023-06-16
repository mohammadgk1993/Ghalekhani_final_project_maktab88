const express = require('express');
const router = express.Router();
const { roleAc } = require('../middlewares/ac/ac')
const { isLogin } = require('../middlewares/auth/auth');
const {
    registerUser,
    loginUser,
    logout,
    uploadAvatar,
    updateUser,
    deleteUser
} = require("../controllers/userControllers");
const { loginValidator , accessValidator, registerValidator } = require('../middlewares/userMiddleware');


router.post("/register", registerValidator, registerUser)

router.post("/login", loginValidator, loginUser);

router.get("/logout", isLogin, logout);

router.post("/uploadAvatar", isLogin, uploadAvatar)

router.patch("/", isLogin, updateUser)

router.delete("/:id", isLogin, accessValidator, deleteUser)


module.exports = router;