var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express(); 

app.use(express.static(path.join(__dirname, '/client'))); 
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:discussion_board'); 

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

mongoose.model('Topics', TopicsSchema); 
mongoose.model('Users', UsersSchema);

var categories = ['HTML','Ruby on Rails','UX','Web Development']; 
var topics = ['work', 'Getting through stress', 'jackson']; 

app
	.get('/topics', function(req, res){
		res.json(topics)
	})
	.get('/html', function(req, res){
		res.json(categories)
	})


app.listen(8000, function(){
	console.log("Listening at port: 8000"); 
});