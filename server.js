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
mongoose.connect('mongodb://localhost:discussion_board'); 

// Create model schemas 
var TopicsSchema = new mongoose.Schema({
	topic:String, 
	category:String, 
	description:String,
	date:{type:Date, default:Date.now}, 
	_messages:[{
		created_by:String, 
		content:String, 
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
var topics = ['work', 'Getting through stress', 'jackson']; 
var sessionName = '';

// Routes
app
	.get('/topics', function(req, res){
		res.json(topics)
	})
	.get('/html', function(req, res){
		res.json(categories)
	})
	.post('/login', function(req, res){
		sessionName = req.body.name;
		if(req.body.name){
			res.redirect('/#/dashboard');
		} else {
			console.log('Please enter a name');
			console.log('laksdjf;lajdsf');
		}
	})
	.get('/session', function(req, res){
		res.json(sessionName)
	})
	.get('/topics', function(req, res){
		res.json({topic:'board', category:'html',description:'i love playing'})
	})
	.post('/topics', function(req, res){
		console.log(req.body)
		var topic = new Topics(req.body)
		console.log(topic)
		topic.save(); 
		Topics.find({}, function(err, data){
			res.json(data)
		})
	})
	

// Set listening port
app.listen(8000, function(){
	console.log("Listening at port: 8000"); 
});