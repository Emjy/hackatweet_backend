var express = require('express');
var router = express.Router();
require('../models/connection');
const Tweet = require('../models/tweets');
const User = require('../models/users');

const { extractHashtags } = require('../modules/extractHashtags')


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
 
 



router.get('/allTweet', (req, res) => {

    Tweet.find()
        .then(tweets => {
            if (tweets) {
                res.json({ result: true, tweets })
            } else {
                res.json({ result: true, message: 'no tweets' });
            }
        })

});

router.post('/tweet', (req, res) => {


    User.find({ username: req.body.username })
        .then(user => {

            const hashtags = extractHashtags(req.body.content);

            console.log('Extracted hashtags:', hashtags); // Log the extracted hashtags

            const newTweet = new Tweet({
                date: new Date(),
                content: req.body.content,
                hashtags,
                likes: 0,
                user: user._id
            });

            newTweet.save()
                .then(newTweet => {
                    res.json({ result: true, tweet: newTweet });
                });

        })

});


module.exports = router; 
