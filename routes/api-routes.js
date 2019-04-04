var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

module.exports = function (app) {
  // route for scraping the Gamespot website for articles
  app.get("/scrape", function (req, res) {
    console.log('request worked!');
    axios.get("https://www.gamespot.com/news/").then(function (response) {
      var $ = cheerio.load(response.data);
      var resultArray = [];
      console.log('second console log');
      $("article.media-article").each(function (i, element) {
        var result = {};
        result.title = $(this)
          .children("a")
          .children("div.media-body")
          .children("h3")
          .text();
        result.summary = $(this)
          .children("a")
          .children("div.media-body")
          .children("p")
          .text();
        result.link = "https://www.gamespot.com" + $(this)
          .children("a")
          .attr("href");
        resultArray.push(result);
      });
      res.send(resultArray);
    })
    .catch(err => console.log(err.response));
  });

  // Route for saving an article
  app.post("/api/save", (req, res) => {
    let dbArticle = req.body;

    db.Article.update(dbArticle, dbArticle, { upsert: true })
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.json(err));
  });

  // route for deleting an article
  app.post("/api/delete", (req, res) => {
    let articleId = req.body.id;

    db.Article.findOneAndDelete({ _id: articleId })
      .then(articleId => console.log(articleId))
      .catch(err => console.log(err))
  });

  // Route for saving/updating an Article's associated Note
  app.post("/api/comment", (req, res) => {
    db.Note.create(req.body)
      .then(dbNote => db.Article.findOneAndUpdate({ _id: req.body.id }, { note: dbNote._id }, { new: true }))
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.json(err));
  });
};