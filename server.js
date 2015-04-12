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
 * TWITTER OAUTH
 */
var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
    consumerKey: config.twitter.consumer_key,
    consumerSecret: config.twitter.consumer_secret,
    callback: 'https://topkerels.herokuapp.com/oauth/twitter/callback'
});
var localTwitterDb = {};


app.get('/', function (req, res) {
    res.render('main');
});

app.get('/authenticate', function (req, res) {
    twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
        if (error) {
            console.log("Error getting OAuth request token : " + error);
        } else {
            localTwitterDb[requestToken] = requestTokenSecret;
            res.redirect(twitter.getAuthUrl(requestToken));
        }
    });
});

app.get('/oauth/twitter/callback', function (req, res) {
    twitter.getAccessToken(req.query.oauth_token, localTwitterDb[req.query.oauth_token], req.query.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
        if (error) {
            console.log(error);
        } else {
            localTwitterDb[req.query.oauth_token] = {
                requestTokenSecret: localTwitterDb[req.query.oauth_token],
                accessToken: accessToken,
                accessTokenSecret: accessTokenSecret
            };

            res.send('authenticated');
        }
    });
});

app.listen(port);
util.puts('running');