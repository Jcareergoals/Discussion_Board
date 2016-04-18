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
// session controller 
// board.controller('SessionController', function($scope, SessionFactory){ 
// 	$scope.createNewSession = function(){
// 		SessionFactory.createSession($scope.newSession.name);
// 	}
// }); 
// topic factory
board.factory('TopicFactory', function(){
	factory = {}; 
	topics = []; 
	factory.index = function(callback){
		callback(topics);
	}
	factory.create = function(data, callback){
		topics.push(data);
		console.log(topics);
		callback(topics);
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
