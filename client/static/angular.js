var board = angular.module('board', ['ngRoute']); 

board.config(function($routeProvider){
	$routeProvider
		.when('/', {templateUrl:'./../partials/login.html'})
		.when('/dashboard', {templateUrl:'./../partials/dashboard.html'})
		.when('/topic', {templateUrl:'./../partials/topic.html'})
		.when('/user', {templateUrl:'./../partials/user.html'})
		.otherwise({redirectTo:'/'})
}); 

board.factory('SessionFactory', function(){
	var sessionName = '';
	var factory = {}; 
	factory.createSession = function(data){
		sessionName = data; 
	}
	factory.getSessionName = function(callback){
		callback(sessionName);
	}
	return factory;
}); 

board.controller('SessionController', function($scope, SessionFactory){ 
	$scope.createNewSession = function(){
		SessionFactory.createSession($scope.name);
	}
}); 