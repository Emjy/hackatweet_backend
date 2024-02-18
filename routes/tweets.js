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
        .populate('user')
        .then(tweets => {
            if (tweets) {
                tweets = tweets.sort((a, b) => b.date - a.date)
                res.json({ result: true, tweets })
            } else {
                res.json({ result: true, message: 'no tweets' });
            }
        })

});

router.post('/tweet', (req, res) => {

    User.findOne({ token: req.body.token })
        .then(data => {

            if (data) {
                const hashtags = extractHashtags(req.body.content);

                console.log('Extracted hashtags:', hashtags); // Log the extracted hashtags

                const newTweet = new Tweet({
                    date: new Date(),
                    content: req.body.content,
                    hashtags,
                    likes: [],
                    user: data._id
                });

                newTweet.save()
                    .then(newTweet => {
                        res.json({ result: true, tweet: newTweet });
                    }); 
            } else {
                res.json({ result: false, message: 'Utilisateur non trouvé' });
            }


        })

});

router.put('/like', (req, res) => {
    User.findOne({ token: req.body.token })
        .then(data => {

            Tweet.findById(req.body.tweetId)
                .then(tweet => {
                    if (tweet) {

                        Tweet.findOneAndUpdate({ _id: req.body.tweetId }, { $push: { likes: data.username } }, { new: true })
                            .then(updatedTweet => {
                                if (updatedTweet) {
                                    res.json({ result: true, tweet: updatedTweet });
                                    console.log('like : ', updatedTweet)

                                }

                            })
                    }

                })

        });
});

router.put('/dislike', (req, res) => {
    User.findOne({ token: req.body.token })
        .then(user => {
            if (!user) {
                return res.json({ result: false, message: 'Utilisateur non trouvé' });
            }

            Tweet.findOneAndUpdate(
                { _id: req.body.tweetId },
                { $pull: { likes: user.username } },
                { new: true }
            )
                .then(updatedTweet => {
                    if (updatedTweet) {
                        res.json({ result: true, tweet: updatedTweet });
                        console.log('dislike : ', updatedTweet)
                    }
                })

        })

});


module.exports = router;
