'use strict';

/* Controllers */
ModuleFactory.getModule("users").controller('LoginController', ['$scope', '$translate', '$config', '$logger', function($scope,$translate, $config, $logger) {
	$scope.title = "Login View"; 
}]);