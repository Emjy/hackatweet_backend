var express = require('express');
var router = express.Router();
require('../models/connection');
const Tweet = require('../models/tweets');
/* GET home page. */

// Route DELETE pour supprimer un tweet par son ID
router.delete('/tweets/:id', (req, res) => {
  const tweetId = req.params.id;

  // Recherche du tweet par son ID
  Tweet.findByIdAndDelete(tweetId)
    .then(deletedTweet => {
      if (!deletedTweet) {
        return res.status(404).json({ error: 'Tweet not found' });
      }
      res.json({ message: 'Tweet deleted successfully' });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

module.exports = router;
