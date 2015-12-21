angular.module('app')
.controller('MainController', function($scope) {
    $scope.name = "Ari";
    $scope.sayHello = function() {
        $scope.greeting = "Hello2 " + $scope.name;
    }
});
