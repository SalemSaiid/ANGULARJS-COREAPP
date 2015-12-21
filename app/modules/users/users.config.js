
/**
 * Users Module Configuration
 */

ModuleFactory.createModule({
    module : 'users', // Name of the module
    dependencies : ['ngDraggable','ngKeypad'], // Dependency injection
    states : [
        {
            name: 'users', // State Name
            url: '/users', // State URL
            templateUrl: 'index.html', // Template (it can be URL under 'app/modules/YOUR_MODULE_NAME/views/' or simple HTML code)
            abstract: true // true if your state is just a layout / container
        },
        {
            name: 'users.login',
            url: '/login',
            templateUrl: 'login.html',
            controllers: ['loginController.js'] // List of controllers under 'app/modules/YOUR_MODULE_NAME/controllers/'
        },
        {
            name: 'users.register',
            url: '/register',
            templateUrl: 'register.html',
            services: ['registerService.js'], // List of services under 'app/modules/YOUR_MODULE_NAME/services/'
            controllers: ['registerController.js']
        }
    ]
});