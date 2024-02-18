const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  date: { type: Date},
  content: { type: String },
  hashtags: [String],
  likes: [],
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}
});

const Tweet = mongoose.model('tweets', tweetSchema);

module.exports = Tweet;
