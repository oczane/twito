var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongoose = require('mongoose');
var Tweet = require('./models/tweetmodel');
var Twitter = require('twitter');

mongoose.connect('mongodb://localhost:27017/tcrunch');

var searchText = 'mashable';

var client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});


app.get('/', function(req, res){

	client.stream('statuses/filter', {track: searchText}, function(stream) {
		  stream.on('data', function(tweet) {
	      	savetweets(tweet, searchText, function(error, rtweets) {
	      		io.emit('chat message', tweet.text);
		  	});
	      });
	 
		  stream.on('error', function(error) {
		    throw error;
		  });
	  	  res.sendFile(__dirname + '/index.html');
	});
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});


var savetweets = function(livetweet, client, callback) {
	var tweet = new Tweet();
	tweet.clienttweet = JSON.stringify(livetweet);
	tweet.client = client
	tweet.hasseen = false;
	tweet.adddate = new Date();

	tweet.save(function(err) {
    if (err) {
    	throw err;
    	callback("error", null);clienttweet
    }
    else {
    	callback(null, tweet);
    }
  });

};

http.listen(3000, function(){
  console.log('listening on *:3000');
});