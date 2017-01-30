var express = require('express');
var router = express.Router();

/*
* config file contains the twitter app credentials
*/
var config = require('../config');

/*
* My self created Twitter client that uses Oauth and qs
*/
var TwitterClient = require('./../my-Twitter-client');

_Globals = {
    'tweetCount' : 100
}

/**
 * GET /
 * Returns the index.html template along with the fetched tweets for the hashTag 'custserv'
 */
router.get('/', function(req, res) {

    var twitter = new TwitterClient(config);
    twitter.searchHashTagTweets(

        // params
        {
            'q': '#custserv',
            'count': _Globals.tweetCount
        },

        // error callback
        function(error) {
            res.end('Error occurred! Try Again');
        },

        // success callback
        function(data) {
            var fetchedTweetsString = data;
            fetchedTweetsJSON = JSON.parse(fetchedTweetsString);
            var statuses = fetchedTweetsJSON.statuses;
            var tweetArr = processTweets(statuses);
            res.render('index.html', { 'tweetsArr' : tweetArr })
        }
    );
});

/**
 * GET /api/default
 * Returns the json of the fetched tweets list
 */
router.get('/api/default', function(req, res) {

    var twitter = new TwitterClient(config);
    twitter.searchHashTagTweets(

        // params
        {
            'q' : '#custserv',
            'count' : _Globals.tweetCount
        },

        // error callback
        function(error) {
            res.end('Error occurred' + error);
        },

        // success callback
        function(data) {
            var tweetArr = processTweets(data);
            /*
            * the returned data will be an array so we convert it into JSON
            * and then stringify the data to be sent to the client
            */
            var resData = {
                'statuses' : tweetArr
            }
            res.end(JSON.stringify(resData));
        }
    )

});

/**
* GET /api/tweets/:hashTag
* Returns the index.html template along with the fetched tweets for the hashTag in the url
*/
router.get('/api/tweets/:hashTag', function(req, res) {

    var hashTagStr = String(req.params.hashTag);
    var twitter = new TwitterClient(config);
    twitter.searchHashTagTweets(

        // params
        {
            'q': '#' + hashTagStr,
            'count': _Globals.tweetCount
        },

        // error callback
        function(error) {
            res.end('Error occurred! Try Again');
        },

        // success callback
        function(data) {
            var fetchedTweetsString = data;
            fetchedTweetsJSON = JSON.parse(fetchedTweetsString);
            var statuses = fetchedTweetsJSON.statuses;
            var tweetArr = processTweets(statuses);
            res.render('index.html', { 'tweetsArr' : tweetArr })
        }
    );

});

/**
 * /GET/api/tweets/get-json/:hashTag
 * Returns the json of the fetched tweets list which contains the #custserv
 */
router.get('/api/tweets/get-json/:hashTag', function(req, res) {

    var hashTag = String(req.params.hashTag);
    var twitter = new TwitterClient(config);
    twitter.searchHashTagTweets(

        // params
        {
            'q' : '#' + hashTag,
            'count' : _Globals.tweetCount
        },

        // error callback
        function(error) {
            res.end('Error occurred' + error);
        },

        // success callback
        function(data) {
            var tweetArr = processTweets(data);
            /*
             * the returned data will be an array so we convert it into JSON
             * and then stringify the data to be sent to the client
             */
            var resData = {
                'statuses' : tweetArr
            }
            res.end(JSON.stringify(resData));
        }
    )

});

/**
 * Processes the fetched tweets to find the tweets that have been re-Tweeted atleast once
 *
 * @param { Array|String } tweets The fetched tweets data from the twitter api
 * @return {Array} The tweets array which have been re-Tweeted atleast once
 */
function processTweets(tweets) {

    var data = tweets,
        tweetArr = [];  // Array for storing the tweets that have been re-Tweeted atleast once

    // if this func is called for the route GET /api/default
    if(typeof(data) == 'string') {
        data = JSON.parse(data).statuses;
    }
    // looping through the array to fetch the tweets that have re-Tweet count > 0
    data.forEach(function(tweet) {
       reTweetCount = tweet.retweet_count;
       if(reTweetCount > 0) {
           tweetArr.push(tweet);
       }
    });
    return tweetArr;
}

module.exports = router;
