#Twitter Client
 
A simple twitter client which fetches the tweets containing a particular hashTag and which have been retweeted atleast once and <br/>
have been re-Tweeted atleast once.

#My Research  :P
Twitter is great! and is concerned about our security .<br/>
With Twitter api1.0 , it was pretty easy to get data from twitter using REST apis, <br/>
but with twitter api1.1, oAuth is required, which makes things a little hard.<br/>
Now we are required to create a twitter app and thus we get the credentials which has to be kept safe and secure.<br/>

Now , if we are at the client side and interacting with the Twitter apis, then :<br/>
The nature of oAuth forces the client to expose applications credentials and this is a security vulnerability.<br/>
The provider may not support CORS and makes its impossible for the client to communicate with the provider.<br/>

So a simple and safer solution is needed in which : < br/>
We do not reveal the credentials to the client.<br/>
Should work even if the provider does not support CORS. <br/>
Great !<br/>

#Implementation
I will be doing the things on the server side. In this way there will be no need for exposing the credentials and this the things remain secure.
Then a client can simply request to the server for the resources ( in this case 'Tweets' ) using ajax etc.

I am using node js and the Express Framework ( It is awesome! ) this time for the server side implementation.

###Server Side Implementation
My project structure:<br/>

    node-tweet/
        bin/
            www
        public/
            js/
            css/
            images/
        routes/
            index.js
        views/
            index.html
            error.html
        app.js
        config.js
        my-Twitter-client.js
        package.json
    
    
######my-Twitter-client.js 
I created a twitter client in js.<br/>
I used OAuth and qs node modules for this purpose.<br/>
I used Oauth for the OAuth 1.0 authentication and qs for parsing and stringifying queryString.<br/>
I have created a TwitterClient class for the purpose which has the function searchHashTagTweets to find the tweets corresponding to the 
query 'q'. 
Further details have been provided in the script itself.

I simply required the my-Twitter-client.js in my index.js route for fetching the tweets.
Further details have been added to the index.js routes as the comments.<br/>
My Twitter app credentials are saved in the config.js file on the server side and thus safe and
secure from the client.

I have implemented the following routes :

    GET /
fetches the tweets for the #custserv and the tweets that have been re-Tweeted atleast once.

    GET /api/default
returns the json Object of the fetched tweets which have the #custserv have been re-Tweeted atleast once.
Can be used for ajax request from the client side

    GET /api/tweets/:hashTag
fetches the tweets containing hashTag hashTag (in the url) and returns along side the index.html template

    GET /api/tweets/get-json/:hashTag
returns the JSON object of the fetched tweets which contain the hashTag hashTag and have been re-Tweeted atleast once.
Can be used for making ajax request for the tweets from the client side.

Now CORS may occur when we try to request resources from other server , so i have allowed CORS in each route at the server side to deal with cross origin request.

###Client Side Implementation

At client side i have : 

Implemented a Loader to show to the user while the tweets are being fetched using ajax call. ( for better UX )
The loader is implemented using pure css.

A simple ajax request to fetch all the tweets and show them in list view in the DOM using jquery.

In this case i have made request to the url : http://localhost:3000/api/default
which returns the JSON of the fetched tweets array which contains the hashTag #custserv and have been re-Tweeted atlease once ( as per the task)

But the client can be modified to get the tweets for any particular hashTag using the api 

    GET /api/tweets/get-json/:hashTag

Each tweet in the list item is clickable and when clicked shows a popup which gives the other details about that tweet like re-Tweet count, Tweet user etc.

Structure of the client side:

    client/
        css/
        js/
        client.html 
	

#Running up the Project

Setting up the server first :

Unzip the project

Go into the project dir

    cd twitter-client

Go inside the node-tweet dir ( Server Side )

    cd node-tweet

Insert the twitter app credentials in the config.js file

Install dependencies

    sudo npm install
 
Run the server now :)

    node bin/www
    
this will start the server at port 3000

    localhost:3000
   
Now either you can simply go to the browser and open localhost:3000 and it will fetch the tweets and render it on the page.
You can also try other routes as well as defined and explained above.
or 
you can use the client as described below ( Preferred )

Client Side :

Now go inside the client folder 

	cd client

open the client.html file in the browser.
Wait for some time and it will fetch the tweets containing #custserv and which have been re-Tweeted once.
Click on the tweet for getting more info :)