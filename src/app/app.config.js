 angular.module('app', [  
    'app.init',
    'app.authentication',
     'app.public',
     'app.private'
    ])
   .config(
            ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
                function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
                    // lazy controller, directive and service
                    controller = $controllerProvider.register;
                    directive = $compileProvider.directive;
                    filter = $filterProvider.register;
                    factory = $provide.factory;
                    service = $provide.service;
                    constant = $provide.constant;
                    value = $provide.value;
                }
            ])
   .config(function($stateProvider, $urlRouterProvider) {
	    $urlRouterProvider.otherwise('/home');	    
	    $stateProvider  
	    	.state('app', {
	             templateUrl: 'app/main/views/app.html'
	        })
	        // HOME 
	        .state('app.home', {
	        	title:'Home',
	            url: '/home',
	            templateUrl: 'app/main/views/home.html',
	            controllers: ['mainController.js']
	        })

   	})

     .config(['$translateProvider', function ($translateProvider) {
         // Register a loader for the static files
         // So, the module will search missing translation tables under the specified urls.
         // Those urls are [prefix][langKey][suffix].
         $translateProvider.useStaticFilesLoader({
             prefix: 'app/i18n/',
             suffix: '.json'
         });
         // Tell the module what language to use by default
         $translateProvider.preferredLanguage('en_US');
         // Tell the module to store the language in the local storage
         $translateProvider.useLocalStorage();
     }])

   .run(['$rootScope', '$state',
	    function ($rootScope, $state) {
            $rootScope.$on('$stateChangeSuccess', function (event, current, previous) {
                $rootScope.title = current.title;
            });
	                 
	  }]);

 