
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});


var app = express();

app.use(express.static('public'));

//mongoose.connect('mongodb://localhost/mydb');

var personSchema = mongoose.Schema({
	name 	: String,
	age		: Number,
	nationality	: String
	});
var Person = mongoose.model("Person", personSchema);

app.get('/', function(req, res){	
	res.sendFile(__dirname+"/"+"index.html");
});

app.post('/',function(req, res){
	
});


var server = app.listen(8000, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('server running at http://%s:%s',host, port);
});
