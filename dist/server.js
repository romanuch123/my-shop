var express = require('express');
var path = require('path');

var app = express();

app.get('/', function(req, res) {
  res.sendFile('D:/Programing/BackUp/my-shop/dist/index.html');
});
app.use(express.static(path.join(__dirname, '/public')));

app.listen(3000);

console.log('Server listening on port 3000');