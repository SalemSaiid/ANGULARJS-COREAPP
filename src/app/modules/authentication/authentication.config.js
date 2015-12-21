angular.module('app.authentication', [])

.config([ '$stateProvider', function( $stateProvider) {
    
	var moduleUrl='app/modules/authentication/';
	var moduleTemplate='app/main/views/app.html';
	var moduleName='app.authentication';
	
	$stateProvider  
    .state('authentication', {
        templateUrl: moduleTemplate,
        resolve: scriptUtils.getResolved(moduleName, 
            		[moduleUrl+'services/authenticationService.js'])
    })
    
    .state('authentication.login', {
    	title:'Login',
        url: '/login',
        templateUrl: moduleUrl+'views/login.html',
        controller: 'LoginController',
        resolve: scriptUtils.getResolved(moduleName, 
        		[moduleUrl+'controllers/loginController.js'])
    })
    
    .state('authentication.register', {
    	title:'Register',
        url: '/register',
        templateUrl: moduleUrl+'views/register.html',
        controller: 'RegisterController',
        resolve: scriptUtils.getResolved(moduleName, 
        		[moduleUrl+'controllers/registerController.js'])
    })
 
    ;
}])