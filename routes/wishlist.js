var express = require('express');
var router = express.Router();

const Users = require('../models/users')
const Articles = require('../models/articles')

router.get('/articles/:token', async function (req, res, next) {

  let result = false;
  let wishlist = [];
  let user = await Users.findOne({ token: req.params.token }).populate('wishlist');

  if (user) {
    result = true;
    wishlist = user.wishlist;
  }
  res.json({ result, wishlist });
});

router.post('/article', async function (req, res, next) {

  let result = false;

  let user = await Users.findOne({ token: req.body.token });

  if (user) {
    let article = await Articles.findOne({ title: req.body.article.title })

    // RECHERCHE OU CREATION DE L'ARTICLE ID
    let articleId;
    if (article) { // l'article existe en Bdd

      console.log(user.wishlist);
      console.log(article.id);

      if (user.wishlist.every(item => String(item) !== article.id)) { // il est pas déjà dans la wishlist
        articleId = article.id;
      } else {
        articleId = null;
      }
    }
    else { // l'article n'est pas en bdd 
      let newArticle = new Articles({
        source: req.body.article.source,
        author: req.body.article.author,
        title: req.body.article.title,
        description: req.body.article.description,
        url: req.body.article.url,
        urlToImage: req.body.article.urlToImage,
        publishedAt: req.body.article.publishedAt,
        content: req.body.article.content,
        country: req.body.selectedCountry
      })
      let savedArticle = await newArticle.save();
      articleId = savedArticle.id;
    }

    if (articleId) {
      let newWishlist = [...user.wishlist];
      newWishlist.push(articleId);
      user.wishlist = newWishlist;
      let savedUser = await user.save();
      if (savedUser) {
        result = true;
      }
    }
  }

  res.json({ result });

});

router.delete('/article', async function (req, res, next) {

  console.log(req.query.token)
  console.log(req.query.title)

  let result = false;

  let user = await Users.findOne({ token: req.query.token }).populate('wishlist');

  if (user) {

    console.log('User found');

    let articleIndex = user.wishlist.findIndex(elem => elem.title === req.query.title);

    if (articleIndex >= 0) {

      console.log('Article found in wishlist');

      let newWishlist = [...user.wishlist];
      newWishlist.splice(articleIndex, 1);
      user.wishlist = newWishlist;
      let savedUser = await user.save();

      if (savedUser) {
        console.log('On est bons');
        result = true;
      }
    }
  }
  console.log(result);
  res.json({ result })
});

module.exports = router;