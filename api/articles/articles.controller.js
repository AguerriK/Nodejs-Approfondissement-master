const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const articleService = require("./articles.service");

const articleController = {
  async createArticle(req, res) {
    try {
      const articleData = {
        ...req.body,
        user: req.user._id,
      };
      const article = await articleService.create(articleData);
      req.app.get("io").emit("articleCreated", article);
      res.status(201).json(article);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateArticle(req, res) {
    try {
      const { id } = req.params;
      const { title, content, state } = req.body;
      const userId = req.user._id;

      const article = await articleService.get(id);

      if (!article) {
        throw new NotFoundError("Article not found");
      }

      if (String(article.user) !== String(userId)) {
        throw new UnauthorizedError("Unauthorized");
      }

      if (req.user.role !== "admin") {
        throw new UnauthorizedError("Unauthorized");
      }

      article.title = title;
      article.content = content;
      article.state = state;

      await article.save();

      return res.json({ article });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },

  async deleteArticle(req, res) {
    try {
      const articleId = req.params.id;

      if (req.user.role !== "admin") {
        throw new UnauthorizedError("Unauthorized");
      }

      await articleService.delete(articleId);
      res.sendStatus(204);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getArticlesByUserId(req, res, next) {
    try {
      const userId = req.params.userId;
      const articles = await articleService.getByUserId(userId);
      res.json(articles);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = articleController;