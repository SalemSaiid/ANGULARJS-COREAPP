/**
 * private Module Configuration
 */

angular.module('app.private', [])

    .config([ '$stateProvider', function( $stateProvider) {

        var moduleUrl='app/modules/private/';
        var moduleTemplate='app/main/views/app.html';
        var moduleName='app.private';

        $stateProvider
            .state('private', {
                url: '/private',
                templateUrl: moduleTemplate,
                resolve: scriptUtils.getResolved(moduleName,
                    [moduleUrl+'services/privateService.js'])
            })

            .state('private.accueil', {
                title:'private',
                url: '/accueil',
                templateUrl: moduleUrl+'views/accueil.html',
                controller: 'PrivateController',
                resolve: scriptUtils.getResolved(moduleName,
                    [
                        moduleUrl+'controllers/privateController.js'
                    ])
            });
    }]);