var board = angular.module('board', ['ngRoute']); 

board.config(function($routeProvider){
	$routeProvider
		// .when('/', {templateUrl:'./../partials/login.html'})
		.when('/', {templateUrl:'./../partials/dashboard.html'})
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