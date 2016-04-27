var board = angular.module('board', ['ngRoute']); 
// routes 
	board.config(function($routeProvider){
		$routeProvider
			.when('/', {templateUrl:'./../partials/login.html'})
			.when('/dashboard', {templateUrl:'./../partials/dashboard.html'})
			.when('/topic/:id', {templateUrl:'./../partials/topic.html'})
			.when('/user/:name', {templateUrl:'./../partials/user.html'})
			.otherwise({redirectTo:'/'})
	}); 
	// session factory
	board.factory('SessionFactory', function($http){
		var factory = {}; 
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
		factory.createComment = function(data, callback){
			$http.post('/comments', data).success(function(data){
				callback(data); 
			}); 
		}
		return factory; 
	}); 
// dashboard controller
	board.controller('DashboardController', function($scope, SessionFactory, TopicFactory){
		SessionFactory.index(function(data){
			$scope.session_name = data;
		}); 
		TopicFactory.index(function(data){
			$scope.topics = data; 
		}); 
		$scope.addTopic = function(){
			$scope.newTopic.created_by = $scope.session_name; 
			$scope.newTopic.count = 0; 
			TopicFactory.create($scope.newTopic, function(data){
				$scope.newTopic = {}; 
				$scope.topics = data; 
			});
		}
	}); 
// topics controller
	board.controller('topicsController', function($scope, SessionFactory, TopicFactory, $routeParams){
		$scope.topic = {}; 
		SessionFactory.index(function(data){
			$scope.name = data;
		}); 
		TopicFactory.getTopic($routeParams.id, function(data){
			$scope.topic = data; 
		}); 
		$scope.addMessage = function(){
			$scope.newMessage.created_by = $scope.name; 
			$scope.newMessage.topic_id = $scope.topic._id; 
			TopicFactory.createMessage($scope.newMessage, function(data){
				$scope.topic = data;	
			}); 
		}
		$scope.addLike = function(data){
			TopicFactory.like(data, function(data){
				$scope.topic = data;
			});
		}
		$scope.addDislike = function(data){
			TopicFactory.dislike(data, function(data){
				$scope.topic = data;
			}); 
		}
		$scope.addComment = function(data){
			data.created_by = $scope.name; 
			TopicFactory.createComment(data, function(data){
				$scope.topic._messages = data._messages; 
			}); 
		}
	}); 
// user factory
	board.factory('UserFactory', function($http){
		var factory = {}; 
		factory.index = function(data, callback){
			$http.get('/users/'+data).success(function(data){
				callback(data);
			}); 
		}
		return factory; 
	}); 
// user controller
	board.controller('UserController', function($scope, $routeParams, UserFactory){
		$scope.user = '';
		UserFactory.index($routeParams.name, function(data){
			$scope.user = data;
		}); 
	}); 
