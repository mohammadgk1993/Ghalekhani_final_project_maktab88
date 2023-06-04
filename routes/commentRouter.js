const express = require('express');
const router = express.Router();
// const { isLogin } = require("../middlewares/auth/auth");
const { createComment, getAllComments, readComment, updateComment, deleteComment } = require('../controllers/commentControllers');
const { commentExistance, createCommentValidator, userValidator } = require('../middlewares/commentMiddlewares');
const { isLogin } = require('../middlewares/auth/auth');


router.get("/all",  isLogin, getAllComments)

router.post("/",
isLogin,
 createCommentValidator,
  createComment)

router.get("/:id" , isLogin, commentExistance, readComment)

router.patch("/:id", isLogin, commentExistance, updateComment)

router.delete("/:id", isLogin, userValidator, commentExistance, deleteComment)

// router.delete("/all", async (req,res,next) => {
//     await Article.deleteMany({})
// })

module.exports = router;
