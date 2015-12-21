angular.module("app").directive("header", function() {
  return {
    restrict: 'A',
    templateUrl: 'app/main/views/header.html',
    scope: true,
    transclude : false,
    controller: 'headerController'
  };
});