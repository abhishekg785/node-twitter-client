/**
 * @author : abhishek goswami ( Hiro )
 * abhishek goswami
 *
 */

(function($, $d, $w, d, w) {

    var Globals = {
        url : 'http://localhost:3000/api/default',
        TweetText : [],
        TweetUser : [],
        TweetUserFollowerCount : [],
        ReTweetCount : [],
        FavouriteCount : [],
        isTweetInfoDisplayVisible : false,
        isTweetDataFetched : false,
    }

    $Objects = {}

    _Functions = {

        /**
         * Function that runs on the startup
         */
        init : function() {
            _Functions.ShowLoader();
            _Functions.FetchTweets();
        },

        /**
         * Hides the loader
         */
        HideLoader : function() {
            $Objects.loaderSection.hide();
        },

        /**
         * Shows the loader
         */
        ShowLoader : function() {
            $Objects.loaderSection.show();
        },

        /**
         * Fetches the Tweets by making an ajax call
         */
        FetchTweets : function() {
            $.ajax({
                url : Globals.url,
                type : 'GET',
                dataType : 'json',
                success : function(data) {
                    _Functions.HideLoader();
                    _Functions.PopulateTweetsInDOM(data);
                    Globals.isTweetDataFetched = true;
                },
                error : function(error) {
                    console.log(error);
                }
            })
        },

        /**
         * Sets the data in the Global Arrays and displays the tweets in the DOM in a list order
         *
         * @params { Object } tweetData The tweets object received by ajax call from the flask server
         */
        PopulateTweetsInDOM : function(tweetData) {
            var tweetData = tweetData.statuses || null;
            console.log(tweetData);
            if(tweetData) {
                tweetData.forEach(function(data, i) {
                    Globals.TweetText.push(data.text);
                    Globals.TweetUser.push(data['user']['screen_name']);
                    Globals.TweetUserFollowerCount.push(data['user']['followers_count']);
                    Globals.ReTweetCount.push(data.retweet_count);
                    Globals.FavouriteCount.push(data.favorite_count);
                    $Objects.tweetSection.append('<li class = "clickable" onclick = "_Functions.DisplayTweetInfo('+ i +')" >' + data.text + '</li>');
                });
                console.log(Globals);
            }
            else {
                $Objects.tweetSection.append('<li><em>No Tweets Fetched ! Try again </em></li>');
            }
        },

        /**
         *  Display the Tweet Info
         *
         *  @param { Integer } id Index of the json in the fetched_tweets array
         */
        DisplayTweetInfo : function(id) {
            $Objects.displayTweetInfoList.empty();
            var TweetText = Globals.TweetText[id],
                TweetUser = Globals.TweetUser[id],
                TweetUserFollowerCount = Globals.TweetUserFollowerCount[id],
                FavouriteCount = Globals.FavouriteCount[id],
                ReTweetCount = Globals.ReTweetCount[id];
            var item = '<li><span>Text</span> : '+ TweetText +'</li>' +
                '<li><span>User</span> : '+ TweetUser +'</li>' +
                '<li><span>Followers Count</span> : '+ TweetUserFollowerCount +'</li>' +
                '<li><span>Favourite Count</span> : '+ FavouriteCount +'</li>' +
                '<li><span>Re-Tweet Count</span> : '+ ReTweetCount +'</li>';
            // console.log(item);
            $Objects.displayTweetInfoList.append(item);
            if(!(Globals.isTweetInfoDisplayVisible)) {
                $('.displayTweetInfo').show();
                Globals.isTweetInfoDisplayVisible = true;
            }
        }

    }

    /**
     * the flow of the programme starts here :)
     */
    $d.ready(function() {
        $Objects.loaderSection = $('.loaderSection');
        $Objects.tweetSection = $('.tweetSection ul');
        $Objects.displayTweetInfo = $('.displayTweetInfo');
        $Objects.displayTweetInfoList = $('.displayTweetInfo ul');
        $Objects.closeDisplayTweet = $('#closeDisplayTweet');
        $Objects.notification = $('.notification');
        _Functions.init();

        $Objects.closeDisplayTweet.on('click', function() {
            if(Globals.isTweetInfoDisplayVisible) {
                $Objects.displayTweetInfo.hide();
                Globals.isTweetInfoDisplayVisible = false;
            }
        });

        /**
         * Controls the notification for the user
         * Shows when the mouse is over the body
         */
        $('body').on('mouseover', function() {
            if(Globals.isTweetDataFetched) {
                $Objects.notification.css({
                    right : '0px',
                });
            }
        });
    });

})(jQuery, jQuery(document), jQuery(window), document, window);