var express = require("express");
var app = express();
var db = require("../models");

module.exports = function (app) {
    
    app.get('/', (req, res) => {
        res.render('index');
    });

    app.get('/saved', (req, res) => {
        db.Article.find({})
        .populate("note")
            .then(dbArticle => res.render('saved', { Article: dbArticle }))
            .catch(err => res.json(err));
    });
}