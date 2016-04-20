var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express(); 

// Configure express app 
app.use(express.static(path.join(__dirname, '/client'))); 
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Connect to Mongo Database (MongoDB)
mongoose.connect('mongodb://localhost/discussion_board'); 

// Create model schemas 
var TopicsSchema = new mongoose.Schema({
	topic:String, 
	category:String, 
	description:String,
	date:{type:Date, default:Date.now}, 
	count: 0,
	created_by: String,
	_messages:[{
		created_by:String, 
		content:String, 
		likes: 0, 
		dislikes: 0,
		created_at:{type:Date, default:Date.now},
		_comments:[{
			created_by:String, 
			content:String, 
			created_at:{type:Date, default:Date.now}
		}]
	}]
}); 
var UsersSchema = new mongoose.Schema({
	name: String, 
	created_at:{type:Date, default:Date.now}
}); 

// Create Mongoose models 
mongoose.model('Topics', TopicsSchema); 
mongoose.model('Users', UsersSchema);

var Topics = mongoose.model('Topics');
var Users = mongoose.model('Users');

// Temps 
var categories = ['HTML','Ruby on Rails','UX','Web Development']; 
var sessionName = '';

// Routes
app
	.get('/topics', function(req, res){
		Topics.find({}, function(err, data){
			// console.log(data)
			res.json(data)
		})
	})
	.get('/html', function(req, res){
		res.json(categories)
	})
	.post('/login', function(req, res){
		if(req.body.name){
			sessionName = req.body.name;
			res.redirect('/#/dashboard');
		} else {
			console.log('Please enter a name');
			res.redirect('/');
		}
	})
	.get('/session', function(req, res){
		res.json(sessionName)
	})
	.get('/topic/:id', function(req, res){
		Topics.find({_id:req.params.id}, function(err, data){
			res.json(data)
		})
	})
	.post('/topics', function(req, res){
		var topic = new Topics(req.body)
		topic.created_by = sessionName; 
		topic.save(); 
		Topics.find({}, function(err, data){
			res.json(data)
		})
	})
	.post('/messages', function(req, res){
		console.log(req.body);
		var message = {}
		message.created_by = req.body.created_by
		message.content = req.body.content
		Topics.update({_id:req.body.id}, {$push:{_messages:message}}, function(err, data){
			console.log(err, data)
			Topics.find({_id:req.body.id}, function(err, data){
				console.log(err, data)
				res.json(data)
			})
		})
		// Topics.update({_id:req.body.id}, {$push{_messages:}})
	})

// Set listening port
app.listen(8000, function(){
	console.log("Listening at port: 8000"); 
});