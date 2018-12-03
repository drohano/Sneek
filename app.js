var express = require('express');

var app = express();

var path = require('path');

app.use(express.static(path.join(__dirname, 'assets')));
//app.use(express.static('images'));

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/index.html');
  });

var PORT = process.env.PORT || 4242;

//Start the web server!
app.listen(PORT, function(){
    console.log('Server up and running');
});