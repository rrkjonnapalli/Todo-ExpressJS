var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var url = 'mongodb://localhost:27017/test';

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
app.use(express.static('public'));

var insertDocument = function(db, cb){
	db.collection('users').insertOne({
		name		: myFullname,
		email		: myEmail,
		password	: myPassword
	}, function(err, res){
		assert.equal(err, null);
		console.log('User added');
	});
};

app.post('/person', urlencodedParser ,function(req, res){
	var post = req.body;
	
	myFullname	= post.fullname;
	myEmail		= post.email;
	myPassword	= post.password;
	
	console.log(myFullname +' '+ myEmail +' '+ myPassword);
	
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  insertDocument(db, function() {
		  res.send('user added');
		  db.close();
	  });
	});
	
});
app.get('/', function(req, res){	
	res.sendFile(__dirname+"/"+"index.html");
});

app.get('/login.html', function(req, res){	
	res.sendFile(__dirname+"/"+"login.html");
});

var server = app.listen(8000, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('server running at http://%s:%s',host, port);
});
