/**
 * public Module Configuration
 */

angular.module('app.public', [])

    .config([ '$stateProvider', function( $stateProvider) {

        var moduleUrl='app/modules/public/';
        var moduleTemplate='app/main/views/app.html';
        var moduleName='app.public';

        $stateProvider
            .state('public', {
                url: '/public',
                templateUrl: moduleTemplate,
                resolve: scriptUtils.getResolved(moduleName,[moduleUrl+'services/publicService.js'])
            })

            .state('public.accueil', {
                title:'public',
                url: '/accueil',
                templateUrl: moduleUrl+'views/accueil.html',
                controller: 'PublicController',
                resolve: scriptUtils.getResolved(moduleName,
                    [
                        moduleUrl+'controllers/publicController.js'
                    ])
            });
    }]);