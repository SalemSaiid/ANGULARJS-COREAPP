/* Service */
angular.module("app.private").factory('PrivateService', ['$q','$log',
	    function($q, $log) {
		privateFunction = function(){
	        return true;
        };       
        return{
        	privateFunction: privateFunction
        }
	  }]
	);