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
		likes: {type: Number, default: 0}, 
		dislikes: {type: Number, default: 0},
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
	created_at:{type:Date, default:Date.now}, 
	topics: {type:Number, default: 0}, 
	posts: {type:Number, default: 0}, 
	comments: {type:Number, default: 0}
}); 

// Create Mongoose models 
mongoose.model('Topics', TopicsSchema); 
mongoose.model('Users', UsersSchema);

var Topics = mongoose.model('Topics');
var Users = mongoose.model('Users');

// session
var sessionName = '';

// Routes
app
	.get('/topics', function(req, res){
		Topics.find({}, function(err, data){
			res.json(data)
		})
	})
	.get('/topic/:id', function(req, res){
		Topics.findOne({_id:req.params.id}, function(err, data){
			res.json(data)
		})
	})
	.get('/session', function(req, res){
		res.json(sessionName)
	})
	.get('/users/:name', function(req, res){
		Users.findOne({name:req.params.name}, function(err, data){
			res.json(data)
		})
	})
	
	.post('/login', function(req, res){
		if(req.body.name){
			sessionName = req.body.name
			Users.find({name:req.body.name}, function(err, data){
				if(data.length == 0){
					var user = new Users(req.body)
					user.save()
				} else {
					sessionName = data[0].name
				}
				res.redirect('/#/dashboard')
			})
		} else {
			console.log('Please enter a name')
			res.redirect('/')
		}
	})
	.post('/topics', function(req, res){
		var topic = new Topics(req.body)
		Users.update({name:req.body.created_by}, {$inc:{topics:1}}, function(err, data){
			topic.save()
			Topics.find({}, function(err, data){
				res.json(data)
			})
		})
	})
	.post('/messages', function(req, res){
		var message = {
			created_by:req.body.created_by, 
			content:req.body.content, 
		}
		Topics.update({_id:req.body.topic_id}, {$push:{_messages:message}, $inc:{count:1}}, function(){
			Users.update({name:req.body.created_by}, {$inc:{posts:1}}, function(){
				Topics.findOne({_id:req.body.topic_id}, function(err, data){
					res.json(data)
				})
			})
		})
	})
	.post('/comments', function(req, res){
		Topics.findOne({_id:req.body.topic_id}, function(err, data){
			for(i in data._messages){
				if(data._messages[i]._id == req.body.message_id){
					var comment = {
						created_by: req.body.created_by,
						content: req.body.comment 
					}
					data._messages[i]._comments.push(comment)
					data.save()
				}
			}
		})
		Users.update({name: req.body.created_by}, {$inc:{comments:1}}, function(err, data){
			console.log(err, data)
			Topics.findOne({_id:req.body.topic_id}, function(err, data){
				res.json(data)
			})
		})
	})
	.post('/likes', function(req, res){
		Topics.findOne({_id:req.body.topic_id}, function(err, data){
			for(i in data._messages){
				if(data._messages[i]._id == req.body.message_id){
					data._messages[i].likes += 1 
					data.save()
				} 
			}
		})
		Topics.findOne({_id:req.body.topic_id}, function(err, data){
			res.json(data)
		})
	})
	.post('/dislikes', function(req, res){
		Topics.findOne({_id:req.body.topic_id}, function(err, data){
			for(i in data._messages){
				if(data._messages[i]._id == req.body.message_id){
					data._messages[i].dislikes += 1 
					data.save()
				} 
			}
		})
		Topics.findOne({_id:req.body.topic_id}, function(err, data){
			res.json(data)
		})
	})

// Set listening port
app.listen(8000, function(){
	console.log("Listening at port: 8000"); 
});