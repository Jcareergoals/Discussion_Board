var board = angular.module('board', ['ngRoute']); 
// routes 
board.config(function($routeProvider){
	$routeProvider
		.when('/', {templateUrl:'./../partials/login.html'})
		.when('/dashboard', {templateUrl:'./../partials/dashboard.html'})
		.when('/topic', {templateUrl:'./../partials/topic.html'})
		.when('/user', {templateUrl:'./../partials/user.html'})
		.otherwise({redirectTo:'/'})
}); 
// session factory
board.factory('SessionFactory', function($http){
	var factory = {}; 
	var sessionName = '';
	factory.index = function(callback){
		$http.get('/session').success(function(data){
			callback(data);
		});
	}
	return factory;
}); 
// topic factory
board.factory('TopicFactory', function($http){
	factory = {}; 
	factory.index = function(callback){
		$http.get('/topics').success(function(data){
			callback(data); 
		}); 
	}
	factory.create = function(data, callback){
		$http.post('/topics', data).success(function(data){
			console.log(data);
		}); 
	}
	return factory; 
}); 
// dashboard controller
board.controller('DashboardController', function($scope, SessionFactory, TopicFactory){
	SessionFactory.index(function(data){
		$scope.name = data;
	}); 
	TopicFactory.index(function(data){
		$scope.topics = data; 
		console.log(data);
	}); 
	$scope.addTopic = function(){
		$scope.newTopic.created_by = $scope.name; 
		$scope.newTopic.count = 0; 
		TopicFactory.create($scope.newTopic, function(data){
			$scope.newTopic = {}; 
			$scope.topics = data; 
		});
	}
}); 
