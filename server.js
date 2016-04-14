var express = require('express');
var path = require('path');

app.use(express.static(path.joins(__dirname, '/clients'))); 

app.listen(8000, function(){
	console.log("Listening at port: 8000"); 
});