var board = angular.module('board', ['ngRoute']); 
// routes 
	board.config(function($routeProvider){
		$routeProvider
			.when('/', {templateUrl:'./../partials/login.html'})
			.when('/dashboard', {templateUrl:'./../partials/dashboard.html'})
			.when('/topic/:id', {templateUrl:'./../partials/topic.html'})
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
		factory.getTopic = function(data, callback){
			$http.get('/topic/'+ data).success(function(data){
				callback(data);
			}); 
		}
		factory.create = function(data, callback){
			$http.post('/topics', data).success(function(data){
				console.log('This is the response');
				console.log(data);
				callback(data);
			}); 
		}
		factory.createMessage = function(data, callback){
			$http.post('/messages', data).success(function(data){
				callback(data);
			});
		}
		factory.like = function(data, callback){
			$http.post('/likes/', data).success(function(data){
				callback(data);
			});
		}
		factory.dislike = function(data, callback){
			$http.post('/dislikes', data).success(function(data){
				callback(data);
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
// topics controller
	board.controller('topicsController', function($scope, SessionFactory, TopicFactory, $routeParams){
		$scope.name = '';
		$scope.topic = {}; 
		SessionFactory.index(function(data){
			$scope.name = data;
		}); 
		TopicFactory.getTopic($routeParams.id, function(data){
			// The response data is the 'topic' object
			$scope.topic = data[0]; 
			console.log(data); 
		}); 
		$scope.addMessage = function(){
			$scope.newMessage.created_by = $scope.name; 
			$scope.newMessage.topic_id = $scope.topic._id; 
			TopicFactory.createMessage($scope.newMessage, function(data){
				// 'Topic' object
				$scope.topic = data[0];
				console.log(data);
			}); 
		}
		$scope.addLike = function(data){
			TopicFactory.like(data, function(data){
				console.log(data)
				$scope.topic = data[0];
			});
		}
		$scope.addDislike = function(data){
			TopicFactory.dislike(data, function(data){
				$scope.topic = data[0];
			}); 
		}
		$scope.addComment = function(){
			console.log($scope)
		}
	}); 
