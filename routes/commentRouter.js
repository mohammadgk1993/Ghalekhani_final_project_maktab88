const express = require('express');
const router = express.Router();
const { createComment, getAllComments, readComment, updateComment, deleteComment } = require('../controllers/commentControllers');
const { commentExistance, createCommentValidator, access } = require('../middlewares/commentMiddlewares');
const { isLogin } = require('../middlewares/auth/auth');


router.get("/all",  isLogin, getAllComments)

router.post("/", isLogin, createCommentValidator, createComment)

router.get("/:id" , isLogin, commentExistance, readComment)

router.patch("/:id", isLogin, commentExistance, updateComment)

router.delete("/:id", isLogin, commentExistance, access, deleteComment)


module.exports = router;
