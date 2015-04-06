var express = require('express'),
    util = require('util'),
    Twitter = require('twitter'),
    config = require('./config');

var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('view options', { layout: false }); // NOTE: express3 remove

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    var client = new Twitter(config.twitter);

    var params = {screen_name: 'nodejs'};
    client.get('statuses/user_timeline', params, function(error, tweets, response){
        if (!error) {
            console.log(tweets);
            res.render('main');
        }
    });
});

app.listen(port);
util.puts('running');