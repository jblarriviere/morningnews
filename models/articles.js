const mongoose = require('mongoose');

const sourceSchema = mongoose.Schema({
  id: String,
  name: String
})

const articleSchema = mongoose.Schema({
  source: sourceSchema,
  author: String,
  title: String,
  description: String,
  url: String,
  urlToImage: String,
  publishedAt: Date,
  content: String,
  country: String,
});

module.exports = mongoose.model('articles', articleSchema);