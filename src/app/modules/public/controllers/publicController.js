'use strict';
/* Controllers */
angular.module("app.public").controller('PublicController', ['$scope', '$translate', '$rootScope','$state','PublicService', function($scope,$translate, $rootScope,$state,PublicService) {

	//Test carousel
	function getSlide(target) {
        var i = target.length;
        return {
            id: (i + 1),
            label: 'slide #' + (i + 1),
            img: 'assets/img/b'+i+'.jpg',
            //color: $scope.colors[ (i*10) % $scope.colors.length],
            odd: (i % 2 === 0)
        };
    }

    function addSlide(target) {
        target.push(getSlide(target));
    };
    
    $scope.carouselIndex3 = 5;

    function addSlides(target, qty) {
        for (var i=0; i < qty; i++) {
            addSlide(target);
        }
    }

    $scope.slides = [];
    addSlides($scope.slides, 9);
	
}]);