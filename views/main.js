
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});

var cookieParser = require('cookie-parser');
var multer = require('multer');
var session = require('express-session');
var upload = multer();


app.use(express.static('public'));

app.use(upload.array());
app.use(session({secret				:"It's my session",
				resave 				: true,
				saveUninitialized	: true,
				secure				: true
}));

var url = 'mongodb://localhost:27017/mydb';
var mydb;
MongoClient.connect(url, function(err, db){
	assert.equal(null, err);
	mydb = db;
});



app.get('/', function(req, res){
	res.redirect('/registerform');
});
app.get('/index', function(req, res){
	if(req.session.user === undefined){
		res.redirect('/');
	}else{
		res.sendFile(__dirname+'/'+'index.html');
	}
});
app.get('/scripts/jquery-1.10.2.js', function(req, res){
	res.sendFile(__dirname+'/'+'scripts/jquery-1.10.2.js');
});
app.get('/styles/w3.css', function(req, res){
	res.sendFile(__dirname+'/'+'styles/w3.css');
});

app.get('/registerform', function(req, res){
	res.sendFile(__dirname+'/'+'register.html');
});
app.get('/loginform', function(req, res){
	res.sendFile(__dirname+'/'+'login.html');
});
app.get('/gettasks', function(req, res){
	mydb.collection("tasks").find({'user':req.session.user}).toArray(function(err, result) {  
		if (err){
			console.log(err);
		}else{
			res.send(result);
		};
	});
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
	login(response, req, res);
});

app.post('/addtask', urlencodedParser, function(req, res){
	task = {
		user		: req.session.user,
		title 		: req.body.title,
		description	: req.body.description,
		time		: req.body.time
	}
	addtask(task, res);
});
app.post('/removetask', urlencodedParser, function(req, res){
	console.log(req.body);
	/*
	var query = {'_id' : req.body.id};
	mydb.collection('tasks').remove(query, function(err, obj){
		if(err){
			console.log(err);
		}else{
			res.redirect('/index');
		}
	});
	*/
});
app.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/loginform');
});



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
	mydb.collection("users").findOne({username:response.username}, function(err, result){
		if (err){
			console.log(err);
		}else if(result != null){
			res.send('username alredy exists');
		}else{
			var flag = register(response);
			if(flag){
				res.redirect('/loginform')
			}else{
				res.send('Sorry there is some internal error. please try after sometime');
			}
		}
	});
}

function login(response, req, res){
	mydb.collection("users").findOne({username:response.username, password:response.password}, function(err, result){
		if (err){
			console.log(err);
		}else if(result === null){
			res.send('Invalid username or password');
		}else{
			req.session.user = response.username;
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
	
}

app.listen(3000, function(err, res){
	if(err){
		console.log(err);
	}else{
		console.log("Server running at 'http://localhost:3000'");
	}
});
