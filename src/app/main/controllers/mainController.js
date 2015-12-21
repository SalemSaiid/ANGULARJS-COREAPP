'use strict';

/* Controllers */

angular.module("app").controller('MainController', ['$scope','$translate','$localStorage', '$window', '$location','$rootScope', '$timeout','$state',
    function($scope, $translate,$localStorage, $window, $location,$rootScope,$timeout,$state ) {
	
      $scope.routeIs = function(routeName) {
	    return $location.path() === routeName;
	  };

	  $scope.app = {
        settings: {
          test: 1
        }
	  };
	  // Save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){ 
    	  // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);
      
	  
      //Angular translate
      $scope.lang = { isopen: false };
      $scope.langs = {en_US:'English', ar_TN:'Arabe', fr_FR:'Français'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {

        // set the current lang 
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
          //alert($scope.selectLang);
      }; 
      
      //Menu
      $scope.showmenu=false;
      $scope.toggleMenu = function(){
    	  $scope.showmenu=($scope.showmenu) ? false : true;
    	  $scope.titleView=$rootScope.currentView;
      }
      $rootScope.currentView="Home";
      $scope.titleView=$rootScope.currentView;
      
      //Gauge
      
      $scope.animationTime = 20;
      $scope.value = 2500;
      $scope.maxValue = 3000;
   	  $scope.gaugeType = 'donut';

      $scope.gaugeOptions = {
          lines: 24,
          // The number of lines to draw
          angle: 0,
          // The length of each line
          lineWidth: 0.20,
          // The line thickness
          pointer: {
              length: 0.8,
              // The radius of the inner circle
              strokeWidth: 0.015,
              // The rotation offset
              color: '#B70000' // Fill color
          },
          limitMax: 'false',
          // If true, the pointer will not go past the end of the gauge
          colorStart: '#B70000',
          // Colors
          colorStop: '#51A351',
          // just experiment with them
          strokeColor: '#E0E0E0',
          // to see which ones work best for you
          percentColors: [[0.0, "#00FF2D" ], [0.50, "#00A91E"], [1.0, "#008417"]],
          generateGradient: true
      };
  }]);