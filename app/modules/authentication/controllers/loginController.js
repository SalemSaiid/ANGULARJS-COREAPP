'use strict';

/* Controllers */
angular.module('app.authentication').controller('LoginController', ['$scope', '$translate', '$rootScope', function($scope,$translate, $rootScope) {    
	$scope.titleView = "Login"; 
	$rootScope.currentView="Login";
	
	/*
	$scope.$watch(function(scope) { return scope.username; },
		     function(newValue, oldValue) {
		   
		   console.log(newValue);
		  } 
    );
	*/
}]);