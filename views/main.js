
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
app.use(express.static('public'));

var url = 'mongodb://localhost:27017/mydb';
var mydb;
var username;
var tasksObject;
MongoClient.connect(url, function(err, db){
	assert.equal(null, err);
	console.log('Connected correctly to server');
	mydb = db;
});

function gettasks(username){
	mydb.collection("tasks").find({'user':username}).toArray(function(err, result) {  
		if (err){
			console.log(err);
		}else{
			//console.log(result);
			tasksObject = result;
			//res.send(result);
			//res.redirect('/index');
		};
	});
}


function getMyDetails(err, res){
	return tasksObject;
}


function register(response){
	mydb.collection('users').insertOne(response, function(err, res){
		if(err){
			console.log(err);
		}else{
			console.log('User added');
		}
	});
	return true;
}
function checkDuplicateAndRegister(response, res){
	var myflag;
	mydb.collection("users").find({username:response.username}).toArray(function(err, result) {  
		if (err){
			console.log(err);
		}
		if(result.length != 0){
			res.send('username alredy exists');
		}else{
			var flag = register(response);
			if(flag){
				res.redirect('/loginform')
			}else{
				res.send('Sorry there is some internal error. please try after sometime');
			}
		};
	});
}

function login(response, res){
	mydb.collection("users").find({username:response.username, password:response.password}).toArray(function(err, result) {  
		if (err){
			console.log(err);
		}else if(result.length == 0){
			//console.log(result);
			res.send('Invalid username or password');
		}else{
			res.redirect('/index');
		};
	});
}

function addtask(task, response){
	
	mydb.collection('tasks').insertOne(task, function(err, res){
		if(err){
			console.log(err);
		}else{
			console.log('Task added');
			response.redirect('/index');
		}
	});
	
	/*
	mydb.tasks.insertOne(task, function(err, res){
		if(err){
			return console.log(err);
		}
		console.log('task added');
	});
	*/
}

app.get('/', function(req, res){
	res.redirect('/registerform');
});

app.get('/gettasks', function(req, res){
	res.send(tasksObject);
});

app.get('/index', function(req, res){
	gettasks(username);
	res.sendFile(__dirname+'/'+'index.html');
});

app.get('/main.js', function(req, res){
	res.sendFile(__dirname+'/'+'main.js');
});
app.get('/a.js', function(req, res){
	res.sendFile(__dirname+'/'+'a.js');
});

app.get('/registerform', function(req, res){
	res.sendFile(__dirname+'/'+'register.html');
});
app.get('/loginform', function(req, res){
	res.sendFile(__dirname+'/'+'login.html');
});
app.get('/main.js', function(req, res){
	res.sendFile(__dirname+'/'+'main.js');
});
app.post('/register', urlencodedParser, function(req, res){
	response = {
		fullname	: req.body.fullname,
		username	: req.body.email,
		password	: req.body.password
		};
	
	checkDuplicateAndRegister(response, res);
});

app.post('/login', urlencodedParser, function(req, res){
	username = req.body.email;
	response = {
		username	: req.body.email,
		password	: req.body.password
		};
	login(response, res);
});

app.post('/addtask', urlencodedParser, function(req, res){
	task = {
		user		: username,
		title 		: req.body.title,
		description	: req.body.description,
		time		: req.body.time
	}
	addtask(task, res);
});

app.listen(3000);
