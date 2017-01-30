/**
 * author : abhishek goswami
 * abhishekg785@gmail.com
 *
 * my-Twitter-client.js : A simple lib to get data from the twitter api1.1
 * The lib uses oauth for handling oAuth and qs for parsing and stringifying queryString
 */

var OAuth = require('oauth').OAuth;
var qs = require('qs');

(function() {

    Globals = {
        baseUrl : 'https://api.twitter.com/1.1',
        requestTokenURL : 'https://api.twitter.com/oauth/request_token',
        accessTokenURL : 'https://api.twitter.com/oauth/access_token'
    }

    /**
     * Set the twitter app credentials passsed as a parameters
     *
     * @param { Object } config The config file of the twitter app credentials
     * @constructor
     */
    function TwitterClient(config) {

        var config = config || {};

        this.consumerKey = config.CONSUMER_KEY;
        this.consumerSecret = config.CONSUMER_SECRET;
        this.accessTokenKey = config.ACCESS_TOKEN_KEY;
        this.accessTokenSecret = config.ACCESS_TOKEN_SECRET;
        this.callBackURL = config.callBackURL || null;
        this.baseUrl = Globals.baseUrl;
        this.init = init;
        this.init();
    }

    /**
     * init : Calls the OAuth 1.0 ( OAuth required above )
     */
    function init() {
        this.oauth = new OAuth(
            Globals.requestTokenURL,
            Globals.accessTokenURL,
            this.consumerKey,
            this.consumerSecret,
            '1.0',                              // OAuth version 1.0
            this.callBackURL,
            'HMAC-SHA1'                         // Signature method for security purpose
        );
    }

    /**
     * Syntax for the request for the 10 tweets containing hashtag #custserv is :
     * https://api.twitter.com/1.1/search/tweets.json?q=%23custserv&count=10,
     * this means we require two params : count and the string to search for
     *
     * @params { JSON } params The JSON of the parameters : count and the query string like { 'q' : '#custserv', count : 10 }
     * @params { Function } error The callback function called if error occurs
     * @params { Function } success The callback function called when data is fetched successfully :)
     */
    TwitterClient.prototype.searchHashTagTweets = function(params, error, success) {
        var queryString = params.q,
            count = params.count;
        var encodedQuery = encodeURIComponent(queryString);
        path = '/search/tweets.json?q=' + encodedQuery + '&count=' + String(count);
        url = this.baseUrl + path;
        this.fetchData(url, error, success);
    }

    /**
     * Fetches the data using twitter api and Oauth connection
     *
     * @params { String } url The url to which the request will be made
     * @params { Function } callback The function to be called after the request is made
     */
    TwitterClient.prototype.fetchData = function(url, error, success) {

        // Handles the url mismatch b/w oauth and normal url
        url = url.replace(/\!/g, "%21")
            .replace(/\'/g, "%27")
            .replace(/\(/g, "%28")
            .replace(/\)/g, "%29")
            .replace(/\*/g, "%2A");

        this.oauth.get(url, this.accessTokenKey, this.accessTokenSecret, function(err, body, response) {
            console.log('Request made to [%s]', url);
            if(!err && response.statusCode == 200) {
                success(body);
            }
            else{
                error(err);
            }
        });
    }

    module.exports = TwitterClient;

})();
