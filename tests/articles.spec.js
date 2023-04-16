const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Article = require('../api/articles/articles.model');
const ArticleService = require("../api/articles/articles.service");
const ArticleController = require("../api/articles/articles.controller");

describe("ArticleController", () => {
  let articleController;

  beforeEach(() => {
    articleController = {
      createArticle: jest.fn(),
      updateArticle: jest.fn(),
      deleteArticle: jest.fn(),
      getArticlesByUserId: jest.fn(),
    };
  });

  describe("POST /api/articles", () => {
    it("should create a new article", async () => {
      const req = {
        body: {
          title: "Test Article",
          content: "This is a test article.",
        },
        user: {
          _id: "123",
        },
        app: {
          get: jest.fn(() => ({
            emit: jest.fn(),
          })),
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const article = new Article({
        title: "Test Article",
        content: "This is a test article.",
        user: "123",
      });
      article.save = jest.fn(() => Promise.resolve(article));

      Article.mockReturnValueOnce(article);

      await ArticleController.createArticle(req, res);

      expect(articleController.createArticle).toHaveBeenCalledWith(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(article);
    });
  });

  describe("PUT /api/articles/:id", () => {
    it("should update an existing article", async () => {
      const req = {
        params: {
          id: "123",
        },
        body: {
          title: "Updated Test Article",
          content: "This is an updated test article.",
          state: "published",
        },
        user: {
          _id: "123",
          role: "admin",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const article = new Article({
        _id: "123",
        title: "Test Article",
        content: "This is a test article.",
        user: "123",
      });
      article.save = jest.fn(() => Promise.resolve());

      ArticleService.get = jest.fn(() => Promise.resolve(article));

      await ArticleController.updateArticle(req, res);

      expect(articleController.updateArticle).toHaveBeenCalledWith(req, res);
      expect(res.json).toHaveBeenCalledWith({ article });
    });
  });

  describe("DELETE /api/articles/:id", () => {
    it("should delete an article", async () => {
      const req = {
        params: {
          id: "123",
        },
        user: {
          role: "admin",
        },
      };
      const res = {
        sendStatus: jest.fn(),
      };

      await ArticleController.deleteArticle(req, res);

      expect(articleController.deleteArticle).toHaveBeenCalledWith(req, res);
      expect(res.sendStatus).toHaveBeenCalledWith(204);
    });
  });

  describe("GET /api/users/:userId/articles", () => {
	  it("should get articles by user ID", async () => {
		const req = {
		  params: {
			userId: "123",
		  },
		};
		const res = {
		  json: jest.fn(),
		};
		const articles = [      new Article({        title: "Test Article 1",        content: "This is a test article 1.",        user: "123",      }),      new Article({        title: "Test Article 2",        content: "This is a test article 2.",        user: "123",      }),    ];

		ArticleService.getByUserId = jest.fn(() => Promise.resolve(articles));

		await articleController.getArticlesByUserId(req, res);

		expect(ArticleService.getByUserId).toHaveBeenCalledWith("123");
		expect(res.json).toHaveBeenCalledWith(articles);
	  });

	  it("should handle errors", async () => {
		const req = {
		  params: {
			userId: "123",
		  },
		};
		const res = {
		  json: jest.fn(),
		};
		const error = new Error("Test error");

		ArticleService.getByUserId = jest.fn(() => Promise.reject(error));

		await articleController.getArticlesByUserId(req, res);

		expect(ArticleService.getByUserId).toHaveBeenCalledWith("123");
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ message: "Server Error" });
	  });
	});
});