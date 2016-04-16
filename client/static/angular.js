var board = angular.module('board', ['ngRoute']); 

board.config(function($routeProvider){
	$routeProvider
		.when('/', {templateUrl:'./../partials/login.html'})
		.when('/dashboard', {templateUrl:'./../partials/dashboard.html'})
		.when('/topic', {templateUrl:'./../partials/topic.html'})
		.when('/user', {templateUrl:'./../partials/user.html'})
		.otherwise({redirectTo:'/'})
}); 

board.factory('loginFactory', function($http){
	var factory = {}; 
	var name = '';
	factory.name = function(data){
		name = data; 
		console.log(data);
	}
	return factory;
}); 

board.controller('login', function($scope, loginFactory){ 
	$scope.login = function(){
		loginFactory.name($scope.name);
	}
	// code for controller  here
}); 