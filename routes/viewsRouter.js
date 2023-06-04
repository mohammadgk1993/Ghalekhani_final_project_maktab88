const express = require('express');
const router = express.Router();
const {
    getAdminPanel,
    getRegisterPage,
    getLoginPage,
    getDashboardPage,
} = require("../controllers/userControllers");
const { createArticlePage } = require("../controllers/articleController")


router.get("/admin", getAdminPanel)

router.get("/register", getRegisterPage);

router.get("/login", getLoginPage);

router.get("/dashboard", getDashboardPage);

router.get("/create-Article", createArticlePage)


module.exports = router;