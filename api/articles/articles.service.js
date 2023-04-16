const Article = require("./articles.model");
const NotFoundError = require("../../errors/not-found");

const articleService = {
  async create(articleData) {
    const article = new Article(articleData);
    await article.save();
    return article;
  },

  async update(id, articleData) {
    const article = await Article.findById(id);
    if (!article) {
      throw new NotFoundError("Article not found");
    }
    Object.assign(article, articleData);
    await article.save();
    return article;
  },

  async delete(id) {
    const article = await Article.findById(id);
    if (!article) {
      throw new NotFoundError("Article not found");
    }
    await article.remove();
  },

  async getByUserId(userId) {
    const articles = await Article.find({ user: userId });
    return articles;
  },
};

module.exports = articleService;