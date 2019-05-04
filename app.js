var express = require('express'),
    app = express(),
    fs = require('fs'),
    path = require('path');

var port = process.env.PORT || 8080;

app.set('view engine', 'ejs');

app.use("/", express.static(__dirname + '/build'));


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/build', 'index.html'));
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});