var express = require('express'),
    util = require('util'),
    config = require('./config');

var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('view options', { layout: false }); // NOTE: express3 remove

app.use(express.static(__dirname + '/public'));

/**
 * TWITTER oauth authentication
 */
var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
    consumerKey: config.consumer_key,
    consumerSecret: config.consumer_secret,
    callback: 'https://topkerels.herokuapp.com/services/twitter/oauth'
});
var fakeTwitterDb = {};


app.get('/', function (req, res) {
    res.render('main');
});

app.get('/authenticate', function (req, res) {
    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
        if (error) {
            console.log("Error getting OAuth request token : " + error);
        } else {
            fakeTwitterDb[requestToken] = requestTokenSecret;
            res.redirect(twitter.getAuthUrl(requestToken));
        }
    });
});

app.get('/oauth/twitter/callback', function (req, res) {
    twitter.getAccessToken(req.oauth_token, fakeTwitterDb[req.oauth_token], req.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
        if (error) {
            console.log(error);
        } else {
            req.cookie('credentials', '1', {accessToken: accessToken, accessTokenSecret: accessTokenSecret});
        }
    });
});

app.listen(port);
util.puts('running');