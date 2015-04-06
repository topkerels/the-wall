var express = require('express'),
    util = require('util');

var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('view options', { layout: false }); // NOTE: express3 remove

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.send('Hello world');
});

app.listen(8080);
util.puts('running');