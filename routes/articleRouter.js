const express = require('express');
const router = express.Router();
const {
    getAllArticles ,createArticle, readArticle, deleteArticle, updateArticle
} = require("../controllers/articleController");
const { thumbnailAvatarUpload } = require('../utils/multer-settings');
const { isLogin } = require("../middlewares/auth/auth");
const { articleExistance, access } = require('../middlewares/articleMiddlewares');


router.get("/all", isLogin, getAllArticles)

router.post("/", isLogin,
  thumbnailAvatarUpload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'contentImages', maxCount: 5 }
    ]), createArticle)

router.get("/:id" , isLogin, articleExistance, readArticle)

router.patch("/:id", isLogin, articleExistance,
  thumbnailAvatarUpload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'contentImages', maxCount: 5 }
    ]),
   updateArticle)

router.delete("/:id", isLogin, articleExistance, access, deleteArticle)


module.exports = router;