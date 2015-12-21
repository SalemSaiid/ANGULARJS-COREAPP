/* Service */
angular.module('app.authentication').factory('AuthenticationService', ['$q','$log',
	    function($q, $log) {
		authenticationFunction = function(){
	        return true;
        };       
        return{
        	authenticationFunction: authenticationFunction
        }
	  }]
	);