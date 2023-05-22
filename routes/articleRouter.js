const express = require('express');
const router = express.Router();
const {
    getAllArticles ,createArticle, readArticle, deleteArticle, updateArticle
} = require("../controllers/articleController");


router.get("/all", getAllArticles)

router.post("/", createArticle)

router.get("/:id" , readArticle)

router.patch("/:id", updateArticle)

router.delete("/:id", deleteArticle)

module.exports = router;
