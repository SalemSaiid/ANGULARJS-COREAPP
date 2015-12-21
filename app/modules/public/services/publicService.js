/* Service */
angular.module("app.public").factory('PublicService', ['$q','$log',
	    function($q, $log) {
        publicFunction = function(){
	        return true;
        };       
        return{
        	publicFunction: publicFunction
        };
	  }]
	);