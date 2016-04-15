var board = angular.module('board', ['ngRoute']); 

board.config(function($routeProvider){
	$routeProvider
		.when('/', {templateUrl:'./../partials/login.html'})
		.when('/dashboard', {templateUrl:'./../partials/dashboard.html'})
		.when('/topic', {templateUrl:'./../partials/topic.html'})
		.when('/user', {templateUrl:'./../partials/user.html'})
		.otherwise({redirectTo:'/'})
}); 

board.factory('', function($http){
	var factory = {}; 
	// code for factory
	return factory
}); 

board.controller('', function($scope){
	// code for controller in here
}); 