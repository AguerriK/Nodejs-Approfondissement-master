const express = require("express");
const articlesController = require("./articles.controller");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth");

router.post("/", authMiddleware, articlesController.createArticle);
router.put("/:id", authMiddleware, articlesController.updateArticle);
router.delete("/:id", authMiddleware, articlesController.deleteArticle);
router.get("/user/:userId", articlesController.getArticlesByUserId);

module.exports = router;